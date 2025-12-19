import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import {
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Search,
  Star,
  ChevronRight,
} from 'lucide-react'
import { useEvents } from '@/features/events/api'
import { formatTime, getEventTypeLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EventWithCounts } from '@/types/database'

// 2026 Gradient palette
const gradients = [
  'from-[#8B5CF6] via-[#EC4899] to-[#F97316]',
  'from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]',
  'from-[#F97316] via-[#EF4444] to-[#EC4899]',
  'from-[#10B981] via-[#06B6D4] to-[#3B82F6]',
  'from-[#EC4899] via-[#8B5CF6] to-[#06B6D4]',
]

const eventTypes = [
  { value: 'all', label: 'Wszystkie', icon: Calendar },
  { value: 'lesson', label: 'Lekcje', icon: BookOpen },
  { value: 'workshop', label: 'Warsztaty', icon: GraduationCap },
  { value: 'social', label: 'Social', icon: PartyPopper },
]

export function EventsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [eventType, setEventType] = useState('all')

  const { data, isLoading, isError } = useEvents({
    search: search || undefined,
    eventType: eventType !== 'all' ? eventType : undefined,
    status: 'published',
  })

  const events = data?.data || []

  return (
    <div className="min-h-screen pb-6">
      {/* HEADER - Tight */}
      <header className="px-4 pt-12 pb-4">
        <div className="mb-4">
          <h1 className="text-headline-lg">Wydarzenia</h1>
          <span className="text-caption text-xs">Odkryj w Twojej okolicy</span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj..."
            className="input-premium pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Filter pills - Compact */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-4 px-4 scrollbar-hide">
          {eventTypes.map((type) => {
            const Icon = type.icon
            const isActive = eventType === type.value

            return (
              <button
                key={type.value}
                onClick={() => setEventType(type.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-white text-[var(--color-text-secondary)] border border-black/[0.04]'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {type.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* FEATURED - Horizontal scroll */}
      {events.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-headline-sm">Polecane</h2>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 px-4 scrollbar-hide">
            {events.slice(0, 4).map((event) => (
              <FeaturedEventCard
                key={event.id}
                event={event}
                onPress={() => navigate(`/events/${event.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* LIST */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-headline-sm">Nadchodzące</h2>
          <span className="text-caption text-xs">{data?.count || 0}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="card-premium p-6 text-center">
            <p className="text-body-sm text-red-500">Błąd</p>
          </div>
        ) : events.length === 0 ? (
          <div className="card-premium p-6 text-center">
            <Calendar className="w-6 h-6 text-[var(--color-text-tertiary)] mx-auto mb-2" />
            <h3 className="text-headline-sm mb-0.5">Brak</h3>
            <p className="text-caption text-xs">
              {search || eventType !== 'all' ? 'Nie znaleziono' : 'Brak wydarzeń'}
            </p>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            {events.slice(3).map((event, idx) => (
              <EventRow
                key={event.id}
                event={event}
                onPress={() => navigate(`/events/${event.id}`)}
                isLast={idx === events.slice(3).length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// FEATURED EVENT CARD
function FeaturedEventCard({ event, onPress }: { event: EventWithCounts; onPress: () => void }) {
  const startDate = new Date(event.start_at)
  const gradientIndex = event.title.charCodeAt(0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-40 text-left active:scale-[0.97] transition-transform"
    >
      <div className={cn(
        'relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md',
        `bg-gradient-to-br ${gradient}`
      )}>
        {/* Date badge */}
        <div className="absolute top-2 left-2 bg-white/95 rounded-xl px-2.5 py-1.5 shadow-sm">
          <span className="text-xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-[8px] font-bold text-[var(--color-brand)] uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Free badge */}
        {event.price === 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[var(--color-accent-mint)] flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <span className="text-[9px] font-semibold text-white/60 uppercase tracking-wider">
            {getEventTypeLabel(event.event_type)}
          </span>
          <h3 className="text-white font-semibold text-sm leading-tight mt-0.5 line-clamp-2">
            {event.title}
          </h3>
          {event.city && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-2.5 h-2.5 text-white/50" />
              <span className="text-[10px] text-white/60">{event.city}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// EVENT ROW
function EventRow({ event, onPress, isLast }: { event: EventWithCounts; onPress: () => void; isLast: boolean }) {
  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const gradientIndex = event.title.charCodeAt(0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <button
      onClick={onPress}
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left',
        !isLast && 'border-b border-black/[0.03]',
        isPast && 'opacity-50'
      )}
    >
      {/* Date box */}
      <div className={cn(
        'w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0',
        `bg-gradient-to-br ${gradient}`
      )}>
        <span className="text-lg font-bold text-white leading-none">
          {startDate.getDate()}
        </span>
        <span className="text-[8px] font-bold text-white/70 uppercase">
          {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-headline-sm truncate">{event.title}</span>
          {event.price === 0 && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--color-accent-mint)]/10 text-[var(--color-accent-mint)] text-[8px] font-bold">FREE</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-caption text-xs">
          <span className="text-[var(--color-brand)] font-medium">
            {getEventTypeLabel(event.event_type)}
          </span>
          <span>· {formatTime(event.start_at)}</span>
          {event.city && (
            <span className="flex items-center gap-0.5 truncate">
              · <MapPin className="w-2.5 h-2.5" />{event.city}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] flex-shrink-0" />
    </button>
  )
}
