import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconBox } from './IconBox'

interface ListRowProps {
  icon: React.ReactNode
  iconVariant?: 'brand' | 'muted' | 'accent'
  /** If true, icon is rendered as-is without wrapping in IconBox */
  rawIcon?: boolean
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
  showChevron?: boolean
  isLast?: boolean
  onClick?: () => void
  as?: 'button' | 'div'
  className?: string
}

export function ListRow({
  icon,
  iconVariant = 'brand',
  rawIcon = false,
  title,
  subtitle,
  rightElement,
  showChevron = false,
  isLast = false,
  onClick,
  as = 'button',
  className,
}: ListRowProps) {
  const Component = as

  return (
    <Component
      onClick={onClick}
      className={cn(
        'w-full flex items-center p-4 gap-4 text-left',
        onClick && 'hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors cursor-pointer',
        !isLast && 'border-b border-black/[0.04]',
        className
      )}
    >
      {rawIcon ? icon : (
        <IconBox variant={iconVariant}>
          {icon}
        </IconBox>
      )}

      <div className="flex-1 min-w-0">
        <span className="text-headline-sm block truncate">{title}</span>
        {subtitle && (
          <span className="text-caption text-xs truncate block">{subtitle}</span>
        )}
      </div>

      {rightElement}

      {showChevron && (
        <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)] flex-shrink-0" />
      )}
    </Component>
  )
}
