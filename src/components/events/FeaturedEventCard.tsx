import { MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGradientForName, ROUNDED, BADGE, ICON, FEATURED_CARD } from '@/lib/constants'
import { getEventTypeLabel } from '@/lib/utils'
import type { EventWithCounts } from '@/types/database'

interface FeaturedEventCardProps {
  event: EventWithCounts
  onPress: () => void
}

export function FeaturedEventCard({ event, onPress }: FeaturedEventCardProps) {
  const startDate = new Date(event.start_at)
  const gradient = getGradientForName(event.title)

  return (
    <button
      onClick={onPress}
      aria-label={`Zobacz wydarzenie: ${event.title}`}
      className={cn(FEATURED_CARD.base, FEATURED_CARD.event)}
    >
      <div className={cn(
        'relative aspect-[4/5] overflow-hidden shadow-xl',
        ROUNDED.card,
        `bg-gradient-to-br ${gradient}`
      )}>
        {/* Top-left shine */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent via-30% to-transparent pointer-events-none" />

        {/* Date badge */}
        <div className={cn('absolute top-2 left-2 bg-[var(--color-bg-card)] px-3 py-2 shadow-lg', ROUNDED.pill)}>
          <span className="text-xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-[8px] font-bold text-[var(--color-text-secondary)] uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Free badge */}
        {event.price === 0 && (
          <div className={cn('absolute top-2 right-2', BADGE.icon, 'bg-[var(--color-accent-mint)]')}>
            <Star className={cn(ICON.xs, 'text-white')} />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 via-60% to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <span className="text-[9px] font-semibold text-white/60 uppercase tracking-wider">
            {getEventTypeLabel(event.event_type)}
          </span>
          <h3 className="text-white font-semibold text-sm leading-tight mt-0.5 line-clamp-2">
            {event.title}
          </h3>
          {event.city && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className={cn(ICON.xxs, 'text-white/50')} />
              <span className="text-[10px] text-white/60">{event.city}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
