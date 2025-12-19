import { MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGradientForName } from '@/lib/constants'
import { formatTime, getEventTypeLabel } from '@/lib/utils'
import type { EventWithCounts } from '@/types/database'

interface EventRowProps {
  event: EventWithCounts
  onPress: () => void
  isLast: boolean
}

export function EventRow({ event, onPress, isLast }: EventRowProps) {
  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const gradient = getGradientForName(event.title)

  return (
    <button
      onClick={onPress}
      aria-label={`Zobacz wydarzenie: ${event.title}`}
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
