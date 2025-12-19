import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spinner, Avatar, PageHeader, ListRow } from '@/components/ui'
import { ArrowLeft, Send, MessageCircle } from 'lucide-react'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/features/chat/api'
import { useAuthStore } from '@/lib/auth'
import { formatRelativeTime, cn } from '@/lib/utils'
import { ROUNDED, BADGE, ICON, ICON_CONTAINER, LAYOUT, STATE_ICON, GAP, AVATAR_SIZE } from '@/lib/constants'

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

  useEffect(() => {
    if (urlConversationId) {
      setSelectedConversation(urlConversationId)
    }
  }, [urlConversationId])

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId)
    navigate(`/chat/${convId}`, { replace: true })
  }

  const handleBackToList = () => {
    setSelectedConversation(null)
    navigate('/chat', { replace: true })
  }

  useEffect(() => {
    if (selectedConversation) {
      markAsReadMutation.mutate(selectedConversation)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!messageText.trim() || !selectedConversation) return
    sendMutation.mutate({ conversationId: selectedConversation, content: messageText.trim() })
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
        <PageHeader title="Czat" subtitle="Twoje konwersacje" />

        <section className={LAYOUT.sectionLast}>
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
              <div className={cn(STATE_ICON.container, STATE_ICON.error)}>
                <MessageCircle className={cn(ICON.lg, 'text-red-500')} />
              </div>
              <h3 className="text-headline-sm mb-1">Blad ladowania</h3>
              <p className="text-caption text-red-500">{(error as Error)?.message || 'Nieznany blad'}</p>
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
              <div className={cn(STATE_ICON.container, 'bg-[var(--color-bg)]')}>
                <MessageCircle className={cn(ICON.lg, 'text-[var(--color-text-tertiary)]')} />
              </div>
              <h3 className="text-headline-sm mb-1">Brak konwersacji</h3>
              <p className="text-caption">Dopasuj sie z kims, aby rozpoczac czat</p>
            </div>
          ) : (
            <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
              {conversations.filter((conv) => conv.other_user).map((conv, index, arr) => (
                <ListRow
                  key={conv.id}
                  rawIcon
                  icon={
                    <div className="relative flex-shrink-0">
                      <Avatar src={conv.other_user.profile_photo_url} name={conv.other_user.name} size={AVATAR_SIZE.listRow} shape="rounded" alt={`Zdjecie ${conv.other_user.name}`} />
                      {conv.other_user.is_active && (
                        <div className={cn('absolute -bottom-1 -right-1 bg-[var(--color-accent-mint)] border-2 border-white', BADGE.indicator)} />
                      )}
                    </div>
                  }
                  title={conv.other_user.name}
                  subtitle={conv.last_message_preview || 'Brak wiadomosci'}
                  onClick={() => handleSelectConversation(conv.id)}
                  isLast={index === arr.length - 1}
                  rightElement={
                    <div className={cn('flex flex-col items-end', GAP.xs)}>
                      {conv.last_message_at && <span className="text-caption text-xs">{formatRelativeTime(conv.last_message_at)}</span>}
                      {conv.unread_count > 0 && (
                        <span className={cn('min-w-[20px] h-5 px-1.5 bg-[var(--color-brand)] text-white text-[11px] font-medium flex items-center justify-center', ROUNDED.circle)}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  // Chat view
  return (
    <div className="flex flex-col h-screen">
      <header className="px-5 pt-13 pb-3 bg-white/90 backdrop-blur-xl border-b border-black/[0.04]">
        <div className={cn('flex items-center', GAP.lg)}>
          <button onClick={handleBackToList} aria-label="Wroc" className={cn(ICON_CONTAINER.md, 'bg-[var(--color-bg)] flex items-center justify-center', ROUNDED.circle)}>
            <ArrowLeft className={cn(ICON.md, 'text-[var(--color-text-primary)]')} />
          </button>
          <div className={cn('flex items-center flex-1', GAP.md)}>
            <Avatar src={selectedConv?.other_user.profile_photo_url} name={selectedConv?.other_user.name || ''} size="sm" shape="rounded" alt="" />
            <div>
              <span className="text-headline-sm block">{selectedConv?.other_user.name}</span>
              <span className="text-caption">
                {selectedConv?.other_user.is_active ? 'Aktywny teraz' : selectedConv?.other_user.last_seen_at ? `Ostatnio ${formatRelativeTime(selectedConv.other_user.last_seen_at)}` : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-5 py-5">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-4">👋</span>
            <p className="text-caption">Napisz pierwsza wiadomosc!</p>
          </div>
        ) : (
          <div className={cn('space-y-3')}>
            <div className="text-center py-4"><span className="text-caption">Poczatek konwersacji</span></div>
            {messages.map((message, index) => {
              const isMyMessage = message.sender_id === user?.id
              const showAvatar = !isMyMessage && (index === 0 || messages[index - 1]?.sender_id !== message.sender_id)
              return (
                <div key={message.id} className={cn('flex', GAP.sm, isMyMessage ? 'justify-end' : 'justify-start')}>
                  {!isMyMessage && showAvatar && <Avatar src={selectedConv?.other_user.profile_photo_url} name={selectedConv?.other_user.name || ''} size="xs" shape="rounded" alt="" />}
                  {!isMyMessage && !showAvatar && <div className="w-8" />}
                  <div className={cn('max-w-[75%] px-4 py-3 text-body-sm', isMyMessage ? cn('bg-[var(--color-brand)] text-white', ROUNDED.card, 'rounded-br-lg') : cn('bg-[var(--color-bg-card)] border border-black/[0.04]', ROUNDED.card, 'rounded-bl-lg'))}>
                    {message.content}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
        <div className={cn('flex items-center', GAP.md)}>
          <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={handleKeyPress} placeholder="Napisz wiadomosc..." className={cn('flex-1 px-4 py-3 bg-[var(--color-bg)] text-body-md outline-none', ROUNDED.input)} />
          <button onClick={handleSend} disabled={!messageText.trim() || sendMutation.isPending} aria-label="Wyslij" className={cn('w-12 h-12 flex items-center justify-center transition-all', ROUNDED.card, messageText.trim() ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)]')}>
            <Send className={ICON.md} />
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
