import { useState, useRef, useEffect } from 'react'
import {
  Navbar,
  Messagebar,
  Messages,
  Message,
  MessagesTitle,
  Preloader,
} from 'konsta/react'
import { Send } from 'lucide-react'
import { useConversations, useMessages, useSendMessage, useMarkAsRead } from '@/features/chat/api'
import { useAuthStore } from '@/lib/auth'
import { formatRelativeTime, getInitials } from '@/lib/utils'

export function ChatPage() {
  const user = useAuthStore((state) => state.user)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations, isLoading: isLoadingConversations } = useConversations()
  const { data: messages, isLoading: isLoadingMessages } = useMessages(selectedConversation || '')
  const sendMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()

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

  const selectedConv = conversations?.find((c) => c.id === selectedConversation)

  // Conversation list view
  if (!selectedConversation) {
    return (
      <div className="pb-20">
        <Navbar title="Czat" className="top-0 sticky z-10" />

        {isLoadingConversations ? (
          <div className="flex items-center justify-center py-20">
            <Preloader />
          </div>
        ) : !conversations || conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <span className="text-6xl mb-4">💬</span>
            <h3 className="text-lg font-medium mb-2">Brak konwersacji</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Dopasuj się z kimś, aby rozpocząć czat
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {conversations.filter((conv) => conv.other_user).map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center overflow-hidden">
                    {conv.other_user.profile_photo_url ? (
                      <img
                        src={conv.other_user.profile_photo_url}
                        alt={conv.other_user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-medium text-brand-600">
                        {getInitials(conv.other_user.name)}
                      </span>
                    )}
                  </div>
                  {conv.other_user.is_active && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">
                      {conv.other_user.name}
                    </span>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(conv.last_message_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {conv.last_message_preview || 'Brak wiadomości'}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-xs font-medium flex items-center justify-center">
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
    )
  }

  // Chat view
  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Header */}
      <Navbar
        left={
          <button
            onClick={() => setSelectedConversation(null)}
            className="text-brand-500 font-medium"
          >
            Wróć
          </button>
        }
        title={selectedConv?.other_user.name || 'Czat'}
        subtitle={
          selectedConv?.other_user.is_active
            ? 'Aktywny teraz'
            : selectedConv?.other_user.last_seen_at
            ? `Ostatnio ${formatRelativeTime(selectedConv.other_user.last_seen_at)}`
            : undefined
        }
        className="top-0 sticky z-10"
      />

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-20">
            <Preloader />
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <span className="text-4xl mb-4">👋</span>
            <p className="text-gray-500">Napisz pierwszą wiadomość!</p>
          </div>
        ) : (
          <Messages>
            <MessagesTitle>
              <span className="text-gray-500 text-sm">
                Początek konwersacji
              </span>
            </MessagesTitle>

            {messages.map((message, index) => {
              const isMyMessage = message.sender_id === user?.id
              const showAvatar =
                !isMyMessage &&
                (index === 0 || messages[index - 1]?.sender_id !== message.sender_id)

              return (
                <Message
                  key={message.id}
                  type={isMyMessage ? 'sent' : 'received'}
                  first={showAvatar}
                  last={
                    index === messages.length - 1 ||
                    messages[index + 1]?.sender_id !== message.sender_id
                  }
                  tail={
                    index === messages.length - 1 ||
                    messages[index + 1]?.sender_id !== message.sender_id
                  }
                  className="message-animate"
                >
                  <span slot="text">{message.content}</span>
                </Message>
              )
            })}

            <div ref={messagesEndRef} />
          </Messages>
        )}
      </div>

      {/* Message input */}
      <Messagebar
        placeholder="Napisz wiadomość..."
        value={messageText}
        onInput={(e) => setMessageText(e.target.value)}
        onSubmit={handleSend}
        className="sticky bottom-20"
      >
        <button
          slot="inner-end"
          onClick={handleSend}
          disabled={!messageText.trim() || sendMutation.isPending}
          className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </Messagebar>
    </div>
  )
}
