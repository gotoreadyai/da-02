import { cn } from '@/lib/utils'
import { LAYOUT, GAP } from '@/lib/constants'

interface PageHeaderProps {
  title: string
  subtitle?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, leftElement, rightElement, children, className }: PageHeaderProps) {
  return (
    <header className={cn(LAYOUT.header, className)}>
      <div className={cn('flex items-center justify-between', children && 'mb-5')}>
        <div className={cn('flex items-center', GAP.lg)}>
          {leftElement}
          <div>
            <h1 className="text-2xl font-bold mb-1">{title}</h1>
            {subtitle && <span className="text-body-sm text-[var(--color-text-secondary)]">{subtitle}</span>}
          </div>
        </div>
        {rightElement}
      </div>
      {children}
    </header>
  )
}
