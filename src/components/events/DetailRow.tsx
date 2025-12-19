import { cn } from '@/lib/utils'
import { IconBox } from '@/components/ui/IconBox'
import { LIST_ITEM } from '@/lib/constants'

interface DetailRowProps {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
  isLast?: boolean
}

export function DetailRow({ icon, label, value, accent, isLast }: DetailRowProps) {
  return (
    <div className={cn(
      'flex items-center',
      LIST_ITEM.padding,
      !isLast && LIST_ITEM.border
    )}>
      <IconBox size="md" variant={accent ? 'accent' : 'brandLight'}>
        {icon}
      </IconBox>
      <div className="flex-1">
        <span className="text-caption text-[10px] uppercase tracking-wider">{label}</span>
        <span className="text-headline-sm block">{value}</span>
      </div>
    </div>
  )
}
