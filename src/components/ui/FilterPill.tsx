import { cn } from '@/lib/utils'
import { ROUNDED, ICON } from '@/lib/constants'
import type { LucideIcon } from 'lucide-react'

interface FilterPillProps {
  label: string
  isActive: boolean
  onClick: () => void
  icon?: LucideIcon
}

export function FilterPill({ label, isActive, onClick, icon: Icon }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-all',
        ROUNDED.pill,
        isActive
          ? 'bg-[var(--color-brand)] text-white'
          : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-white/[0.06]'
      )}
    >
      {Icon && <Icon className={ICON.xs} />}
      {label}
    </button>
  )
}
