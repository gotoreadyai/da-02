import { cn } from '@/lib/utils'
import { ICON_CONTAINER, ROUNDED } from '@/lib/constants'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function IconButton({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        ICON_CONTAINER[size],
        'flex items-center justify-center transition-all',
        ROUNDED.circle,
        variant === 'default' && 'bg-[var(--color-bg-card)]',
        variant === 'danger' && 'bg-red-500/20 text-red-400',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
