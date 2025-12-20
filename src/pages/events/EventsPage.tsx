import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, PageHeader, IconButton, FilterPill, InputField, Button } from '@/components/ui'
import { FeaturedEventCard, EventRow, CreateEventSheet } from '@/components/events'
import { Calendar, BookOpen, GraduationCap, PartyPopper, Search, Plus } from 'lucide-react'
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
  const [showCreateSheet, setShowCreateSheet] = useState(false)

  const { data, isLoading, isError } = useEvents({
    search: search || undefined,
    eventType: eventType !== 'all' ? eventType : undefined,
    status: 'published',
  })

  const events = data?.data || []

  return (
    <div className={LAYOUT.pageWithNav}>
      <PageHeader
        title="Wydarzenia"
        subtitle="Odkryj w Twojej okolicy"
        rightElement={
          <IconButton
            onClick={() => setShowCreateSheet(true)}
            aria-label="Utworz wydarzenie"
            className="bg-[var(--color-brand)] text-white"
          >
            <Plus className={ICON.md} />
          </IconButton>
        }
      >
        {/* Search */}
        <div className={LAYOUT.sectionHeadingMargin}>
          <InputField
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj..."
            icon={<Search className={ICON.sm} />}
          />
        </div>

        {/* Filter pills */}
        <div className={cn(LAYOUT.horizontalScrollWrapper, 'gap-2')}>
          {eventTypes.map((type) => (
            <FilterPill
              key={type.value}
              label={type.label}
              icon={type.icon}
              isActive={eventType === type.value}
              onClick={() => setEventType(type.value)}
            />
          ))}
        </div>
      </PageHeader>

      {/* Featured - Horizontal scroll */}
      {events.length > 0 && (
        <section className={LAYOUT.section}>
          <div className={cn('flex items-center justify-between', LAYOUT.sectionHeadingMargin)}>
            <h2 className="text-headline-sm">Polecane</h2>
          </div>

          <div className={cn(LAYOUT.horizontalScrollWrapper, 'gap-3 pb-2')}>
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
      <section className={LAYOUT.section}>
        <div className={cn('flex items-center justify-between', LAYOUT.sectionHeadingMargin)}>
          <h2 className="text-headline-sm">Nadchodzace</h2>
          <span className="text-caption text-xs">{data?.count || 0}</span>
        </div>

        {isLoading ? (
          <div className={LAYOUT.loadingState}>
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

      {/* Moje wydarzenia button */}
      <section className={LAYOUT.sectionLast}>
        <Button variant="secondary" onClick={() => navigate('/events/my')}>
          Moje wydarzenia
        </Button>
      </section>

      <CreateEventSheet isOpen={showCreateSheet} onClose={() => setShowCreateSheet(false)} />
    </div>
  )
}
