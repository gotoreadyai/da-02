import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IconBox } from './IconBox'
import { ICON } from '@/lib/constants'

interface ListRowProps {
  icon: React.ReactNode
  iconVariant?: 'brand' | 'brandLight' | 'muted' | 'accent'
  /** If true, icon is rendered as-is without wrapping in IconBox */
  rawIcon?: boolean
  title: string
  /** Custom title element - if provided, replaces default title rendering */
  titleElement?: React.ReactNode
  subtitle?: string
  /** Custom subtitle element - if provided, replaces default subtitle rendering */
  subtitleElement?: React.ReactNode
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
  titleElement,
  subtitle,
  subtitleElement,
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
        onClick && 'hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors cursor-pointer',
        !isLast && 'border-b border-white/[0.06]',
        className
      )}
    >
      {rawIcon ? icon : (
        <IconBox variant={iconVariant}>
          {icon}
        </IconBox>
      )}

      <div className="flex-1 min-w-0">
        {titleElement || <span className="text-headline-sm block truncate">{title}</span>}
        {subtitleElement || (subtitle && (
          <span className="text-caption text-xs truncate block">{subtitle}</span>
        ))}
      </div>

      {rightElement}

      {showChevron && (
        <ChevronRight className={cn(ICON.md, 'text-[var(--color-text-tertiary)] flex-shrink-0')} />
      )}
    </Component>
  )
}
