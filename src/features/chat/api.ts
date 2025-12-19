import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Message } from '@/types/database'

// Query keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
}

export interface ConversationWithParticipant {
  id: string
  last_message_at?: string
  last_message_preview?: string
  other_user: {
    id: string
    name: string
    profile_photo_url?: string
    is_active?: boolean
    last_seen_at?: string
  }
  unread_count: number
}

// Fetch conversations
async function fetchConversations(): Promise<ConversationWithParticipant[]> {
  const { data, error } = await supabase.rpc('get_my_conversations')
  
  if (error) throw error
  return data || []
}

// Fetch messages for a conversation
async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!sender_id(id, name, profile_photo_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

// Send message
interface SendMessageData {
  conversationId: string
  content: string
}

async function sendMessage({ conversationId, content }: SendMessageData): Promise<Message> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Mark conversation as read
async function markAsRead(conversationId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('conversation_participants')
    .update({
      last_read_at: new Date().toISOString(),
      unread_count: 0,
    })
    .eq('conversation_id', conversationId)
    .eq('user_id', user.id)

  if (error) throw error
}

// Hooks
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: fetchConversations,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient()

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Add new message to cache
          queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: Message[] | undefined) => {
              if (!old) return [payload.new as Message]
              // Avoid duplicates
              if (old.some(m => m.id === (payload.new as Message).id)) return old
              return [...old, payload.new as Message]
            }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, queryClient])

  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async ({ conversationId, content }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) })

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Optimistic update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (old: Message[] | undefined) => {
          if (!old) return [optimisticMessage]
          return [...old, optimisticMessage]
        }
      )

      // Update conversation preview
      queryClient.setQueryData(
        chatKeys.conversations(),
        (old: ConversationWithParticipant[] | undefined) => {
          if (!old) return old
          return old.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  last_message_preview: content,
                  last_message_at: new Date().toISOString(),
                }
              : conv
          )
        }
      )

      return { conversationId, optimisticMessage }
    },
    onError: (err, { conversationId }, context) => {
      // Rollback on error
      if (context?.optimisticMessage) {
        queryClient.setQueryData(
          chatKeys.messages(conversationId),
          (old: Message[] | undefined) => {
            if (!old) return []
            return old.filter(m => m.id !== context.optimisticMessage.id)
          }
        )
      }
    },
    onSettled: (_, __, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, conversationId) => {
      // Update unread count locally
      queryClient.setQueryData(
        chatKeys.conversations(),
        (old: ConversationWithParticipant[] | undefined) => {
          if (!old) return old
          return old.map(conv =>
            conv.id === conversationId
              ? { ...conv, unread_count: 0 }
              : conv
          )
        }
      )
    },
  })
}
