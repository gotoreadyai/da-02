import { cn } from '@/lib/utils'

type IconBoxSize = 'sm' | 'md' | 'lg'
type IconBoxVariant = 'brand' | 'brandLight' | 'muted' | 'accent'

interface IconBoxProps {
  children: React.ReactNode
  size?: IconBoxSize
  variant?: IconBoxVariant
  className?: string
  onClick?: (e: React.MouseEvent) => void
  'aria-label'?: string
  'aria-pressed'?: boolean
}

const sizeClasses: Record<IconBoxSize, string> = {
  sm: 'w-9 h-9 rounded-xl',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-11 h-11 rounded-2xl',
}

const variantClasses: Record<IconBoxVariant, string> = {
  brand: 'bg-[var(--color-brand)]/20 text-[var(--color-brand)]',
  brandLight: 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]',
  muted: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
  accent: 'bg-[var(--color-accent-hot)]/10 text-[var(--color-accent-hot)]',
}

export function IconBox({
  children,
  size = 'md',
  variant = 'brand',
  className,
  onClick,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: IconBoxProps) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      className={cn(
        'flex items-center justify-center flex-shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        onClick && 'transition-colors',
        className
      )}
    >
      {children}
    </Component>
  )
}
