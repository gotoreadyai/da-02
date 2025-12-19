import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { FeaturedEventCard, EventRow } from '@/components/events'
import {
  Calendar,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Search,
} from 'lucide-react'
import { useEvents } from '@/features/events/api'
import { cn } from '@/lib/utils'

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
                aria-pressed={isActive}
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
