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

const eventTypes = [
  { value: 'all', label: 'Wszystkie', icon: Calendar },
  { value: 'lesson', label: 'Lekcje', icon: BookOpen },
  { value: 'workshop', label: 'Warsztaty', icon: GraduationCap },
  { value: 'social', label: 'Potańcówki', icon: PartyPopper },
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
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-headline-lg">Wydarzenia</h1>
            <span className="text-caption">Odkryj wydarzenia w Twojej okolicy</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj wydarzeń..."
            className="input-premium pl-12"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-hide">
          {eventTypes.map((type) => {
            const Icon = type.icon
            const isActive = eventType === type.value

            return (
              <button
                key={type.value}
                onClick={() => setEventType(type.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl text-body-sm font-medium whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-black/[0.04]'
                )}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            )
          })}
        </div>
      </header>

      {/* Featured Section */}
      {events.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-6">
            <h2 className="text-headline-md">Polecane</h2>
            <button className="text-xs font-medium text-[var(--color-brand)]">Więcej</button>
          </div>

          {/* Horizontal scroll cards - tight gap */}
          <div className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide">
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

      {/* Upcoming Section */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-md">Nadchodzące</h2>
          <span className="text-caption">{data?.count || 0} wydarzeń</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="card-premium p-8 text-center">
            <p className="text-body-sm text-red-500">Wystąpił błąd</p>
          </div>
        ) : events.length === 0 ? (
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-[var(--color-text-tertiary)]" />
            </div>
            <h3 className="text-headline-sm mb-1">Brak wydarzeń</h3>
            <p className="text-caption">
              {search || eventType !== 'all' ? 'Nie znaleziono wydarzeń' : 'Brak nadchodzących wydarzeń'}
            </p>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            {events.slice(3).map((event, index) => (
              <EventRow
                key={event.id}
                event={event}
                onPress={() => navigate(`/events/${event.id}`)}
                isLast={index === events.slice(3).length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Gradient paleta dla wydarzeń
const eventGradients = [
  'from-[#667EEA] via-[#764BA2] to-[#F093FB]', // Purple dream
  'from-[#FF6B6B] via-[#FF8E53] to-[#FEC89A]', // Sunset warm
  'from-[#4FACFE] via-[#00F2FE] to-[#43E97B]', // Ocean fresh
  'from-[#FA709A] via-[#FEE140] to-[#FFCF48]', // Pink gold
  'from-[#A18CD1] via-[#FBC2EB] to-[#FAD0C4]', // Lavender blush
]

// Featured Event Card - Swiss design inspired
function FeaturedEventCard({ event, onPress }: { event: EventWithCounts; onPress: () => void }) {
  const startDate = new Date(event.start_at)
  const gradientIndex = event.title.charCodeAt(0) % eventGradients.length
  const gradient = eventGradients[gradientIndex]

  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-52 text-left active:scale-[0.98] transition-transform"
    >
      <div className={cn(
        'relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg',
        `bg-gradient-to-br ${gradient}`
      )}>
        {/* Date badge - top left */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-sm">
          <span className="text-2xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-[10px] font-semibold text-[var(--color-brand)] uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Price badge - top right */}
        {event.price === 0 ? (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--color-accent-mint)] flex items-center justify-center shadow-lg">
            <Star className="w-4 h-4 text-white" />
          </div>
        ) : null}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content na dole */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
            {getEventTypeLabel(event.event_type)}
          </span>
          <h3 className="text-white font-semibold text-base leading-tight mt-1 line-clamp-2">
            {event.title}
          </h3>
          {event.city && (
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="w-3 h-3 text-white/60" />
              <span className="text-xs text-white/70">{event.city}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// Event Row - list style like profile menu
interface EventRowProps {
  event: EventWithCounts
  onPress: () => void
  isLast: boolean
}

function EventRow({ event, onPress, isLast }: EventRowProps) {
  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()

  return (
    <button
      onClick={onPress}
      className={cn(
        'w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left',
        !isLast && 'border-b border-black/[0.04]',
        isPast && 'opacity-60'
      )}
    >
      {/* Date box */}
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-light)] flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-headline-md text-[var(--color-brand-dark)] leading-none">
          {startDate.getDate()}
        </span>
        <span className="text-[10px] font-semibold text-[var(--color-brand)] uppercase">
          {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-headline-sm truncate">{event.title}</span>
          {event.price === 0 && (
            <span className="badge badge-success text-[10px] py-0.5">FREE</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-body-sm text-[var(--color-brand)]">
            {getEventTypeLabel(event.event_type)}
          </span>
          <span className="text-caption">• {formatTime(event.start_at)}</span>
          {event.city && (
            <>
              <span className="text-caption">•</span>
              <span className="text-caption flex items-center gap-0.5 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {event.city}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)] flex-shrink-0" />
    </button>
  )
}
