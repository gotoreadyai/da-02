import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON, LAYOUT } from '@/lib/constants'
import { IconButton } from './IconButton'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          'fixed left-0 right-0 bottom-0 z-50 bg-[var(--color-bg-card)]',
          ROUNDED.card,
          'rounded-b-none'
        )}
        style={{ maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className={cn('flex items-center justify-between', LAYOUT.section, 'mb-0 pb-4')}>
          <h3 className="text-headline-md">{title}</h3>
          <IconButton onClick={onClose}>
            <X className={ICON.md} />
          </IconButton>
        </div>

        {/* Content - scrollable */}
        <div
          className={cn(LAYOUT.sectionLast, 'overflow-y-auto pb-8')}
          style={{ maxHeight: 'calc(85vh - 80px)' }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
