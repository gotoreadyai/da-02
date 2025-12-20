import { cn } from '@/lib/utils'
import { INPUT } from '@/lib/constants'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

export function InputField({ icon, rightElement, className, ...props }: InputFieldProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
          {icon}
        </div>
      )}
      <input
        className={cn(
          INPUT.base,
          icon ? INPUT.withIcon : INPUT.standard,
          rightElement && 'pr-14',
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
}
