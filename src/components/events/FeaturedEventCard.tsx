import { MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGradientForName } from '@/lib/constants'
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
