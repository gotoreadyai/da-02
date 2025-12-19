import { cn } from '@/lib/utils'

interface FloatingActionBarProps {
  children: React.ReactNode
  className?: string
}

export function FloatingActionBar({ children, className }: FloatingActionBarProps) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 w-full max-w-md z-40 bg-[var(--color-bg-card)] border-t border-white/[0.06]"
      style={{ bottom: 'var(--bottom-nav-height)' }}
    >
      <div className={cn('flex justify-center px-4 py-4', className)}>
        {children}
      </div>
    </div>
  )
}
