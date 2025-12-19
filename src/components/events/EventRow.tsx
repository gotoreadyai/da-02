import { MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconBox } from '@/components/ui/IconBox'
import { getGradientForName, BADGE, LIST_ITEM, ICON } from '@/lib/constants'
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
        'w-full flex items-center text-left',
        LIST_ITEM.padding,
        LIST_ITEM.interactive,
        !isLast && LIST_ITEM.border,
        isPast && 'opacity-50'
      )}
    >
      {/* Date box - using IconBox with custom gradient */}
      <IconBox className={cn('!bg-transparent', `bg-gradient-to-br ${gradient}`)}>
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white leading-none">
            {startDate.getDate()}
          </span>
          <span className="text-[8px] font-bold text-white/70 uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>
      </IconBox>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-headline-sm truncate">{event.title}</span>
          {event.price === 0 && (
            <span className={cn(BADGE.inline, 'bg-[var(--color-accent-mint)]/10 text-[var(--color-accent-mint)]')}>FREE</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-caption text-xs">
          <span className="text-[var(--color-brand)] font-medium">
            {getEventTypeLabel(event.event_type)}
          </span>
          <span>· {formatTime(event.start_at)}</span>
          {event.city && (
            <span className="flex items-center gap-1 truncate">
              · <MapPin className={ICON.xxs} />{event.city}
            </span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className={cn(ICON.md, 'text-[var(--color-text-tertiary)] flex-shrink-0')} />
    </button>
  )
}
