import { ROUNDED, ICON } from '@/lib/constants'
import { IconBox } from './IconBox'
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
        <IconBox size="sm" variant="brand">
          <Icon className={ICON.sm} />
        </IconBox>
      </div>
      <span className="text-caption">{label}</span>
    </div>
  )
}
