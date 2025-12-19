import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Preloader } from 'konsta/react'
import {
  MapPin,
  Clock,
  Users,
  Music,
  Calendar,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Trophy,
  Mic,
  Search,
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
  { value: 'social', label: 'Potancowki', icon: PartyPopper },
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Wydarzenia</h1>
        <p className="text-gray-500 mb-6">Odkryj wydarzenia taneczne w Twojej okolicy</p>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj wydarzen..."
            className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl pl-12 pr-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all"
          />
        </div>

        {/* Event type filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {eventTypes.map((type) => {
            const Icon = type.icon
            const isActive = eventType === type.value

            return (
              <button
                key={type.value}
                onClick={() => setEventType(type.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-accent-pink text-white shadow-card'
                    : 'bg-white/80 text-gray-600 border border-gray-200/50 hover:border-brand-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured event */}
      {events.length > 0 && events[0] && (
        <div className="px-5 mb-6">
          <FeaturedEventCard
            event={events[0]}
            onPress={() => navigate(`/events/${events[0].id}`)}
          />
        </div>
      )}

      {/* Section title */}
      <div className="px-5 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Nadchodzace wydarzenia</h2>
        {data?.count && (
          <span className="text-sm text-gray-500">{data.count} wydarzen</span>
        )}
      </div>

      {/* Content */}
      <div className="px-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Preloader />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500">Wystapil blad</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📅</span>
            <p className="text-gray-500">
              {search || eventType !== 'all'
                ? 'Nie znaleziono wydarzen'
                : 'Brak wydarzen'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(1).map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => navigate(`/events/${event.id}`)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Featured event card (large banner)
function FeaturedEventCard({ event, onPress }: { event: EventWithCounts; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="w-full relative h-52 rounded-3xl overflow-hidden shadow-card card-interactive text-left"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 event-banner">
        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-5">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
            {eventTypeIcons[event.event_type]}
            {getEventTypeLabel(event.event_type)}
          </span>
        </div>

        <div>
          <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">{event.title}</h3>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(event.start_at)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.city || 'Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Price badge */}
      <div className="absolute top-5 right-5">
        {event.price > 0 ? (
          <span className="bg-white text-gray-900 font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
            {event.price} {event.currency}
          </span>
        ) : (
          <span className="bg-green-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg">
            Bezplatne
          </span>
        )}
      </div>
    </button>
  )
}

// Event card component
interface EventCardProps {
  event: EventWithCounts
  onPress: () => void
  index: number
}

function EventCard({ event, onPress, index }: EventCardProps) {
  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const isFull = event.max_participants
    ? event.participant_count >= event.max_participants
    : false

  return (
    <button
      onClick={onPress}
      className={cn(
        'stagger-item w-full bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-card border border-white/20 card-interactive text-left',
        isPast && 'opacity-60'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex gap-4">
        {/* Date box */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-pink flex flex-col items-center justify-center text-white">
          <span className="text-lg font-bold leading-none">
            {startDate.getDate()}
          </span>
          <span className="text-xs uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Type badge & price */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 bg-brand-100/80 text-brand-700 text-xs px-2 py-1 rounded-full font-medium">
              {eventTypeIcons[event.event_type]}
              <span className="ml-0.5">{getEventTypeLabel(event.event_type)}</span>
            </span>

            {event.price > 0 ? (
              <span className="font-bold text-brand-600 text-sm">
                {event.price} {event.currency}
              </span>
            ) : (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Bezplatne
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{event.title}</h3>

          {/* Info row */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(event.start_at)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.location_type === 'online' ? 'Online' : event.city || 'Brak lokalizacji'}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {event.participant_count}
              {event.max_participants && `/${event.max_participants}`}
            </span>
          </div>

          {/* Dance style & full badge */}
          <div className="flex items-center justify-between mt-2">
            {event.dance_style && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                <Music className="w-3 h-3" />
                {event.dance_style.name}
              </span>
            )}
            {isFull && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                Brak miejsc
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
