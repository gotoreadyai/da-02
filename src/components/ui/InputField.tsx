import { cn } from '@/lib/utils'
import { INPUT } from '@/lib/constants'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export function InputField({ icon, className, ...props }: InputFieldProps) {
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
          className
        )}
        {...props}
      />
    </div>
  )
}
