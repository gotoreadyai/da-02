import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'

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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-accent-mint)]/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-[var(--color-accent-mint)]" />
        </div>
        <h2 className="text-headline-lg mb-2">Sprawdź email</h2>
        <p className="text-caption mb-6">
          Wysłaliśmy link do resetowania hasła na adres {email}
        </p>
        <Link to="/login">
          <button className="w-full py-4 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm">
            Wróć do logowania
          </button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-headline-lg text-center mb-2">Resetuj hasło</h2>
      <p className="text-caption text-center mb-6">
        Podaj email, a wyślemy Ci link do resetowania hasła
      </p>

      <div className="space-y-4 mb-6">
        {/* Email */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Mail className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--color-bg)] text-body-md outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Wyślij link'}
        </button>

        <Link
          to="/login"
          className="w-full py-3 rounded-2xl text-[var(--color-brand)] text-body-sm font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do logowania
        </Link>
      </div>
    </form>
  )
}
