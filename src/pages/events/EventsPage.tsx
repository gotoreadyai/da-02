import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import {
  MapPin,
  Clock,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Trophy,
  Mic,
  Search,
  Bookmark,
  Star,
  ChevronRight,
} from 'lucide-react'
import { useEvents } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { EventWithCounts } from '@/types/database'

const eventTypeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="w-4 h-4" />,
  workshop: <GraduationCap className="w-4 h-4" />,
  social: <PartyPopper className="w-4 h-4" />,
  competition: <Trophy className="w-4 h-4" />,
  performance: <Mic className="w-4 h-4" />,
}

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
        <section className="px-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-headline-md">Polecane</h2>
            <button className="text-body-sm text-[var(--color-brand)]">Zobacz wszystkie</button>
          </div>

          {/* Horizontal scroll cards */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {events.slice(0, 3).map((event) => (
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

// Featured Event Card - like mockup
function FeaturedEventCard({ event, onPress }: { event: EventWithCounts; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-64 card-premium text-left interactive"
    >
      {/* Image */}
      <div className="relative h-40 rounded-t-[2rem] overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
            <span className="text-5xl">💃</span>
          </div>
        )}

        {/* Badge */}
        {event.price === 0 ? (
          <span className="badge badge-success absolute top-3 left-3 shadow-md">
            <Star className="w-3 h-3" />
            BEZPŁATNE
          </span>
        ) : (
          <span className="badge badge-warning absolute top-3 left-3 shadow-md">
            <Trophy className="w-3 h-3" />
            POLECANE
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-headline-sm mb-1 line-clamp-1">{event.title}</h3>

        {/* Category & style */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-body-sm text-[var(--color-brand)]">
            {getEventTypeLabel(event.event_type)}
          </span>
          {event.dance_style?.name && (
            <span className="text-caption"> • {event.dance_style.name}</span>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-caption flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(event.start_at)}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-brand)]">
            <Bookmark className="w-5 h-5" />
          </div>
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
