import { cn } from '@/lib/utils'

type IconBoxSize = 'sm' | 'md' | 'lg'
type IconBoxVariant = 'brand' | 'muted' | 'accent'

interface IconBoxProps {
  children: React.ReactNode
  size?: IconBoxSize
  variant?: IconBoxVariant
  className?: string
}

const sizeClasses: Record<IconBoxSize, string> = {
  sm: 'w-9 h-9 rounded-xl',
  md: 'w-10 h-10 rounded-xl',
  lg: 'w-11 h-11 rounded-2xl',
}

const variantClasses: Record<IconBoxVariant, string> = {
  brand: 'bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]',
  muted: 'bg-[var(--color-bg)] text-[var(--color-text-secondary)]',
  accent: 'bg-[var(--color-accent-hot)]/10 text-[var(--color-accent-hot)]',
}

export function IconBox({ children, size = 'md', variant = 'brand', className }: IconBoxProps) {
  return (
    <div className={cn(
      'flex items-center justify-center flex-shrink-0',
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  )
}
