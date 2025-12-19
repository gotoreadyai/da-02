import { ROUNDED, ICON_CONTAINER } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface StatCardProps {
  value: number
  label: string
  icon: React.ElementType
}

export function StatCard({ value, label, icon: Icon }: StatCardProps) {
  return (
    <div className={cn('bg-[var(--color-bg)] p-4', ROUNDED.card)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-display-md text-[var(--color-text-primary)]">{value}</span>
        <div className={cn(ICON_CONTAINER.sm, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
          <Icon className="w-4 h-4 text-[var(--color-brand-dark)]" />
        </div>
      </div>
      <span className="text-caption">{label}</span>
    </div>
  )
}
