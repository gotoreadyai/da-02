import { cn } from '@/lib/utils'
import { LIST_ITEM, ICON_CONTAINER, ICON } from '@/lib/constants'

interface FormRowProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  isLast?: boolean
}

export function FormRow({ icon, label, children, isLast = false }: FormRowProps) {
  return (
    <div className={cn('flex items-center', LIST_ITEM.padding, !isLast && LIST_ITEM.border)}>
      <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand)]/20 flex items-center justify-center')}>
        <div className={cn(ICON.md, 'text-[var(--color-brand)]')}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <label className="text-caption block mb-1">{label}</label>
        {children}
      </div>
    </div>
  )
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      className={cn('w-full text-headline-sm bg-transparent outline-none', className)}
      {...props}
    />
  )
}
