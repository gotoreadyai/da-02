import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, Edit, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useMyEvents } from '@/features/events/api'
import { Spinner, Button, IconButton, PageHeader, FilterPill } from '@/components/ui'
import { cn } from '@/lib/utils'
import { LAYOUT, ROUNDED, ICON, LIST_ITEM } from '@/lib/constants'

const STATUS_FILTERS = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'published', label: 'Aktywne' },
  { value: 'draft', label: 'Szkice' },
  { value: 'completed', label: 'Zakonczone' },
  { value: 'cancelled', label: 'Odwolane' },
]

export function MyEventsPage() {
  const navigate = useNavigate()
  const { data: events, isLoading } = useMyEvents()
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredEvents = events?.filter((event) => {
    if (statusFilter === 'all') return true
    return event.status === statusFilter
  }) || []

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: typeof AlertCircle; color: string; label: string }> = {
      draft: { icon: AlertCircle, color: 'text-yellow-400 bg-yellow-400/10', label: 'Szkic' },
      published: { icon: CheckCircle, color: 'text-green-400 bg-green-400/10', label: 'Aktywne' },
      cancelled: { icon: XCircle, color: 'text-red-400 bg-red-400/10', label: 'Odwolane' },
      completed: { icon: CheckCircle, color: 'text-gray-400 bg-gray-400/10', label: 'Zakonczone' },
    }
    const c = config[status] || config.draft
    const Icon = c.icon
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 text-xs font-medium', ROUNDED.pill, c.color)}>
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    )
  }

  return (
    <div>
      <PageHeader
        title="Moje wydarzenia"
        subtitle={`${events?.length || 0} wydarzen`}
        leftElement={
          <IconButton onClick={() => navigate(-1)}>
            <ArrowLeft className={ICON.md} />
          </IconButton>
        }
      >
        <div className={cn(LAYOUT.horizontalScrollWrapper, 'gap-2')}>
          {STATUS_FILTERS.map((filter) => (
            <FilterPill
              key={filter.value}
              label={filter.label}
              isActive={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
            />
          ))}
        </div>
      </PageHeader>

      {/* Events list */}
      <section className={LAYOUT.sectionLast}>
        {isLoading ? (
          <div className={LAYOUT.loadingState}>
            <Spinner size="lg" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <Calendar className={cn(ICON.xl, 'text-[var(--color-text-tertiary)] mx-auto mb-3')} />
            <h3 className="text-headline-sm mb-1">Brak wydarzen</h3>
            <p className="text-caption mb-4">
              {statusFilter !== 'all' ? 'Nie masz wydarzen z tym statusem' : 'Nie utworzyles jeszcze zadnych wydarzen'}
            </p>
            <Button onClick={() => navigate('/events/create')}>
              <Plus className={ICON.sm} />
              Utworz wydarzenie
            </Button>
          </div>
        ) : (
          <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
            {filteredEvents.map((event, idx) => (
              <div key={event.id} className={cn(idx !== filteredEvents.length - 1 && 'border-b border-white/[0.06]')}>
                <div className={cn('flex items-center justify-between', LIST_ITEM.padding)}>
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-headline-sm truncate">{event.title}</span>
                      {getStatusBadge(event.status)}
                    </div>
                    <p className="text-caption text-xs">
                      {new Date(event.start_at).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-caption text-xs">
                      {event.participant_count || 0} uczestnikow
                      {event.max_participants && ` / ${event.max_participants}`}
                      {event.price > 0 && ` • ${event.price} PLN`}
                    </p>
                  </div>
                  <IconButton onClick={() => navigate(`/events/${event.id}/edit`)} className="ml-2">
                    <Edit className={ICON.sm} />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <IconButton
        onClick={() => navigate('/events/create')}
        aria-label="Utworz wydarzenie"
        size="lg"
        className="fixed bottom-24 right-5 w-14 h-14 bg-[var(--color-brand)] text-white shadow-lg"
      >
        <Plus className={ICON.lg} />
      </IconButton>
    </div>
  )
}
