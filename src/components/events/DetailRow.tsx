import { cn } from '@/lib/utils'
import { LIST_ITEM, ICON_CONTAINER } from '@/lib/constants'

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
  isLast?: boolean
}

export function DetailRow({ icon, label, value, accent, isLast }: DetailRowProps) {
  return (
    <div className={cn(
      'flex items-center',
      LIST_ITEM.padding,
      !isLast && LIST_ITEM.border
    )}>
      <div className={cn(
        ICON_CONTAINER.md,
        'flex items-center justify-center',
        accent ? 'bg-[var(--color-accent-hot)]/10 text-[var(--color-accent-hot)]' : 'bg-[var(--color-brand-lighter)] text-[var(--color-brand)]'
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <span className="text-caption text-[10px] uppercase tracking-wider">{label}</span>
        <span className="text-headline-sm block">{value}</span>
      </div>
    </div>
  )
}
