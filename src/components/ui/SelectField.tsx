import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { ROUNDED, ICON } from '@/lib/constants'

interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: SelectFieldOption[]
  placeholder?: string
  className?: string
}

export function SelectField({ value, onChange, options, placeholder, className }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full py-4 px-4 pr-10 bg-[var(--color-bg)] text-body-md outline-none appearance-none',
          'focus:ring-2 focus:ring-[var(--color-brand)]/30 transition-all',
          ROUNDED.input,
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className={cn(ICON.sm, 'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-tertiary)]')} />
    </div>
  )
}
