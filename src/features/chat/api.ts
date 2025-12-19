import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
  last_message?: string
  other_user: {
    id: string
    name: string
    profile_photo_url?: string
    is_active?: boolean
    last_seen_at?: string
  }
  other_participant?: {
    id: string
    name: string
    photo_url?: string
    is_online?: boolean
    last_seen?: string
  }
  unread_count: number
  current_user_id?: string
}

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  is_read?: boolean
}

// Fetch conversations with participants using RPC function
async function fetchConversations(): Promise<ConversationWithParticipant[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase.rpc('get_my_conversations')

  if (error) throw error

  if (!data || data.length === 0) {
    return []
  }

  // Map RPC response to our interface
  return data.map((conv: any) => ({
    id: conv.conversation_id,
    last_message_at: conv.last_message_time,
    last_message_preview: conv.last_message,
    last_message: conv.last_message,
    other_user: {
      id: conv.other_user_id || '',
      name: conv.other_user_name || 'Nieznany',
      profile_photo_url: conv.other_user_photo,
      is_active: false,
      last_seen_at: undefined,
    },
    unread_count: conv.my_unread_count || 0,
    current_user_id: user.id,
  }))
}

// Fetch messages for a conversation
async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
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

async function sendMessage({ conversationId, content }: SendMessageData): Promise<ChatMessage> {
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

// Mark conversation as read using RPC function
async function markAsRead(conversationId: string): Promise<void> {
  const { error } = await supabase.rpc('mark_conversation_read', {
    p_conversation_id: conversationId,
  })

  if (error) throw error
}

// Get or create conversation with another user
async function getOrCreateConversation(otherUserId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Try to find existing conversation
  const { data: existingConversations } = await supabase.rpc('get_my_conversations')

  const existing = existingConversations?.find(
    (conv: any) => conv.other_user_id === otherUserId
  )

  if (existing) {
    return existing.conversation_id
  }

  // Create new conversation
  const { data: newConversation, error: convError } = await supabase
    .from('conversations')
    .insert({})
    .select('id')
    .single()

  if (convError) throw convError

  // Add both participants
  const { error: partError } = await supabase
    .from('conversation_participants')
    .insert([
      { conversation_id: newConversation.id, user_id: user.id },
      { conversation_id: newConversation.id, user_id: otherUserId },
    ])

  if (partError) throw partError

  return newConversation.id
}

// Hooks
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: fetchConversations,
    refetchInterval: 30000,
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
          queryClient.setQueryData(
            chatKeys.messages(conversationId),
            (old: ChatMessage[] | undefined) => {
              if (!old) return [payload.new as ChatMessage]
              if (old.some(m => m.id === (payload.new as ChatMessage).id)) return old
              return [...old, payload.new as ChatMessage]
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
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        created_at: new Date().toISOString(),
      }

      queryClient.setQueryData(
        chatKeys.messages(conversationId),
        (old: ChatMessage[] | undefined) => {
          if (!old) return [optimisticMessage]
          return [...old, optimisticMessage]
        }
      )

      queryClient.setQueryData(
        chatKeys.conversations(),
        (old: ConversationWithParticipant[] | undefined) => {
          if (!old) return old
          return old.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  last_message_preview: content,
                  last_message: content,
                  last_message_at: new Date().toISOString(),
                }
              : conv
          )
        }
      )

      return { conversationId, optimisticMessage }
    },
    onError: (_err, { conversationId }, context) => {
      if (context?.optimisticMessage) {
        queryClient.setQueryData(
          chatKeys.messages(conversationId),
          (old: ChatMessage[] | undefined) => {
            if (!old) return []
            return old.filter(m => m.id !== context.optimisticMessage.id)
          }
        )
      }
    },
    onSettled: (_, __, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) })
    },
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, conversationId) => {
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

export function useGetOrCreateConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: getOrCreateConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() })
    },
  })
}
