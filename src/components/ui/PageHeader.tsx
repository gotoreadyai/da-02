import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, rightElement, children, className }: PageHeaderProps) {
  return (
    <header className={cn('px-5 pt-13 pb-5', className)}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          {subtitle && <span className="text-body-sm text-[var(--color-text-secondary)]">{subtitle}</span>}
        </div>
        {rightElement}
      </div>
      {children}
    </header>
  )
}
