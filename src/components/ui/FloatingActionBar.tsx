import { cn } from '@/lib/utils'

interface FloatingActionBarProps {
  children: React.ReactNode
  className?: string
}

export function FloatingActionBar({ children, className }: FloatingActionBarProps) {
  return (
    <div
      className="fixed left-0 right-0 z-40 bg-[var(--color-bg-card)]/90 backdrop-blur-xl border-t border-white/[0.06]"
      style={{ bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom))' }}
    >
      <div className={cn('flex justify-center px-4 py-4', className)}>
        {children}
      </div>
    </div>
  )
}
