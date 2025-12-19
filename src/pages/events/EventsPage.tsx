import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, PageHeader } from '@/components/ui'
import { FeaturedEventCard, EventRow } from '@/components/events'
import { Calendar, BookOpen, GraduationCap, PartyPopper, Search } from 'lucide-react'
import { useEvents } from '@/features/events/api'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON, LAYOUT } from '@/lib/constants'

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
    <div>
      <PageHeader title="Wydarzenia" subtitle="Odkryj w Twojej okolicy">
        {/* Search */}
        <div className={cn('relative', LAYOUT.sectionHeadingMargin)}>
          <Search className={cn('absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]', ICON.sm)} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj..."
            className={cn('input-premium w-full pl-11 py-3 text-sm', ROUNDED.input)}
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          {eventTypes.map((type) => {
            const Icon = type.icon
            const isActive = eventType === type.value

            return (
              <button
                key={type.value}
                onClick={() => setEventType(type.value)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-all',
                  ROUNDED.pill,
                  isActive
                    ? 'bg-[var(--color-brand)] text-white'
                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-white/[0.06]'
                )}
              >
                <Icon className={ICON.xs} />
                {type.label}
              </button>
            )
          })}
        </div>
      </PageHeader>

      {/* Featured - Horizontal scroll */}
      {events.length > 0 && (
        <section className={LAYOUT.section}>
          <div className={cn('flex items-center justify-between', LAYOUT.sectionHeadingMargin)}>
            <h2 className="text-headline-sm">Polecane</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
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

      {/* List */}
      <section className={LAYOUT.sectionLast}>
        <div className={cn('flex items-center justify-between', LAYOUT.sectionHeadingMargin)}>
          <h2 className="text-headline-sm">Nadchodzace</h2>
          <span className="text-caption text-xs">{data?.count || 0}</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <p className="text-body-sm text-red-500">Blad</p>
          </div>
        ) : events.length === 0 ? (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <Calendar className={cn(ICON.xl, 'text-[var(--color-text-tertiary)] mx-auto mb-3')} />
            <h3 className="text-headline-sm mb-1">Brak</h3>
            <p className="text-caption">
              {search || eventType !== 'all' ? 'Nie znaleziono' : 'Brak wydarzen'}
            </p>
          </div>
        ) : (
          <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
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
