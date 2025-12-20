import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON } from '@/lib/constants'

interface SelectOptionProps {
  label: string
  subtitle?: string
  isSelected: boolean
  onClick: () => void
  variant?: 'default' | 'checkbox'
}

export function SelectOption({ label, subtitle, isSelected, onClick, variant = 'default' }: SelectOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full p-4 text-left border transition-all flex items-center justify-between',
        ROUNDED.card,
        isSelected
          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
          : 'border-white/[0.06] bg-[var(--color-bg)]'
      )}
    >
      <div>
        <span className="text-headline-sm block">{label}</span>
        {subtitle && <span className="text-caption text-xs">{subtitle}</span>}
      </div>
      {variant === 'checkbox' ? (
        <div
          className={cn(
            'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
            isSelected
              ? 'bg-[var(--color-brand)] border-[var(--color-brand)]'
              : 'border-white/30'
          )}
        >
          {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>
      ) : (
        isSelected && <Check className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
      )}
    </button>
  )
}

interface SelectGridOptionProps {
  label: string
  subtitle?: string
  isSelected: boolean
  onClick: () => void
}

export function SelectGridOption({ label, subtitle, isSelected, onClick }: SelectGridOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-3 text-left border transition-all relative',
        ROUNDED.card,
        isSelected
          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
          : 'border-white/[0.06] bg-[var(--color-bg)]'
      )}
    >
      <span className="text-headline-sm block">{label}</span>
      {subtitle && <span className="text-caption text-xs">{subtitle}</span>}
      {isSelected && (
        <Check className={cn(ICON.sm, 'text-[var(--color-brand)] absolute top-2 right-2')} />
      )}
    </button>
  )
}
