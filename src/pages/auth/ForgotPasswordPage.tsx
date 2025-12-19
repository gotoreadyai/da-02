import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner, InputField } from '@/components/ui'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'
import { SPACING, BUTTON, ICON, STATE_ICON } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const forgotPassword = useAuthStore((state) => state.forgotPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Podaj adres email')
      return
    }

    setIsLoading(true)
    const result = await forgotPassword(email)
    setIsLoading(false)

    if (result.success) {
      setIsSent(true)
      toast.success('Link do resetowania hasła został wysłany')
    } else {
      toast.error(result.error || 'Wystąpił błąd')
    }
  }

  if (isSent) {
    return (
      <div className="text-center">
        <div className={cn(STATE_ICON.container, STATE_ICON.success)}>
          <CheckCircle className={cn(ICON.xl, 'text-[var(--color-accent-mint)]')} />
        </div>
        <h2 className="text-headline-lg mb-2">Sprawdź email</h2>
        <p className="text-caption mb-5">
          Wysłaliśmy link do resetowania hasła na adres {email}
        </p>
        <Link to="/login">
          <button className={BUTTON.primary}>Wróć do logowania</button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-headline-lg text-center mb-2">Resetuj hasło</h2>
      <p className="text-caption text-center mb-5">
        Podaj email, a wyślemy Ci link do resetowania hasła
      </p>

      <div className={`${SPACING.stack} mb-5`}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isLoading}
          icon={<Mail className={ICON.md} />}
        />
      </div>

      <div className={SPACING.stack}>
        <button type="submit" disabled={isLoading} className={BUTTON.primary}>
          {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Wyślij link'}
        </button>

        <Link
          to="/login"
          className="w-full py-3 text-[var(--color-brand)] text-body-sm font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className={ICON.sm} />
          Wróć do logowania
        </Link>
      </div>
    </form>
  )
}
