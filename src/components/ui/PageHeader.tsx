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
          {subtitle && <span className="text-caption text-xs block">{subtitle}</span>}
          <h1 className="text-headline-lg">{title}</h1>
        </div>
        {rightElement}
      </div>
      {children}
    </header>
  )
}
