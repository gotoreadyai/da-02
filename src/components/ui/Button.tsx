import { cn } from '@/lib/utils'
import { BUTTON } from '@/lib/constants'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
}

export function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(BUTTON[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}
