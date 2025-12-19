import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/features/chat/api'
import { useAuthStore } from '@/lib/auth'
import { formatRelativeTime, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function ChatPage() {
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations, isLoading: isLoadingConversations, isError, error } = useConversations()
  const { data: messages, isLoading: isLoadingMessages } = useMessages(selectedConversation || '')
  const sendMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()

  // Sync URL with state on mount/URL change
  useEffect(() => {
    if (urlConversationId) {
      setSelectedConversation(urlConversationId)
    }
  }, [urlConversationId])

  // Update URL when selecting conversation from list
  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId)
    navigate(`/chat/${convId}`, { replace: true })
  }

  // Handle back to list
  const handleBackToList = () => {
    setSelectedConversation(null)
    navigate('/chat', { replace: true })
  }

  // Mark as read when opening conversation
  useEffect(() => {
    if (selectedConversation) {
      markAsReadMutation.mutate(selectedConversation)
    }
  }, [selectedConversation])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!messageText.trim() || !selectedConversation) return

    sendMutation.mutate({
      conversationId: selectedConversation,
      content: messageText.trim(),
    })
    setMessageText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedConv = conversations?.find((c) => c.id === selectedConversation)

  // Conversation list view
  if (!selectedConversation) {
    return (
      <div className="min-h-screen pb-24">
        {/* Header */}
        <header className="px-6 pt-14 pb-6">
          <h1 className="text-headline-lg">Czat</h1>
          <span className="text-caption">Twoje konwersacje</span>
        </header>

        {/* Content */}
        <div className="px-6">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-headline-sm mb-1">Błąd ładowania</h3>
              <p className="text-caption text-red-500">{(error as Error)?.message || 'Nieznany błąd'}</p>
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="card-premium p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-7 h-7 text-[var(--color-text-tertiary)]" />
              </div>
              <h3 className="text-headline-sm mb-1">Brak konwersacji</h3>
              <p className="text-caption">Dopasuj się z kimś, aby rozpocząć czat</p>
            </div>
          ) : (
            <div className="card-premium overflow-hidden">
              {conversations.filter((conv) => conv.other_user).map((conv, index, arr) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left',
                    index !== arr.length - 1 && 'border-b border-black/[0.04]'
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden">
                      {conv.other_user.profile_photo_url ? (
                        <img
                          src={conv.other_user.profile_photo_url}
                          alt={conv.other_user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                          <span className="text-lg font-light text-white/90">
                            {getInitials(conv.other_user.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    {conv.other_user.is_active && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-accent-mint)] rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-headline-sm truncate">{conv.other_user.name}</span>
                      {conv.last_message_at && (
                        <span className="text-caption flex-shrink-0 ml-2">
                          {formatRelativeTime(conv.last_message_at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-caption truncate">
                        {conv.last_message_preview || 'Brak wiadomości'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--color-brand)] text-white text-[11px] font-medium flex items-center justify-center flex-shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Chat view
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="px-6 pt-14 pb-4 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToList}
            className="w-10 h-10 rounded-full bg-[var(--color-bg)] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              {selectedConv?.other_user.profile_photo_url ? (
                <img
                  src={selectedConv.other_user.profile_photo_url}
                  alt={selectedConv.other_user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                  <span className="text-sm font-light text-white/90">
                    {getInitials(selectedConv?.other_user.name || '')}
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="text-headline-sm block">{selectedConv?.other_user.name}</span>
              <span className="text-caption">
                {selectedConv?.other_user.is_active
                  ? 'Aktywny teraz'
                  : selectedConv?.other_user.last_seen_at
                  ? `Ostatnio ${formatRelativeTime(selectedConv.other_user.last_seen_at)}`
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">👋</span>
            <p className="text-caption">Napisz pierwszą wiadomość!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center py-4">
              <span className="text-caption">Początek konwersacji</span>
            </div>

            {messages.map((message, index) => {
              const isMyMessage = message.sender_id === user?.id
              const showAvatar =
                !isMyMessage &&
                (index === 0 || messages[index - 1]?.sender_id !== message.sender_id)

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-2',
                    isMyMessage ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isMyMessage && showAvatar && (
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      {selectedConv?.other_user.profile_photo_url ? (
                        <img
                          src={selectedConv.other_user.profile_photo_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                          <span className="text-xs font-light text-white/90">
                            {getInitials(selectedConv?.other_user.name || '')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {!isMyMessage && !showAvatar && <div className="w-8" />}

                  <div
                    className={cn(
                      'max-w-[75%] px-4 py-2.5 rounded-2xl text-body-sm',
                      isMyMessage
                        ? 'bg-[var(--color-brand)] text-white rounded-br-md'
                        : 'bg-[var(--color-bg-card)] border border-black/[0.04] rounded-bl-md'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              )
            })}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            className="flex-1 px-4 py-3 rounded-2xl bg-[var(--color-bg)] text-body-md outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || sendMutation.isPending}
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
              messageText.trim()
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)]'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
