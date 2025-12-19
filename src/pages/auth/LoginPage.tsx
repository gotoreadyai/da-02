import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Wypełnij wszystkie pola')
      return
    }

    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)

    if (!result.success) {
      toast.error(result.error || 'Błąd logowania')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-headline-lg text-center mb-6">Zaloguj się</h2>

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

        {/* Password */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
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
          {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Zaloguj się'}
        </button>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-body-sm text-[var(--color-brand)] hover:underline"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <div className="text-center text-caption">
          <span className="text-[var(--color-text-secondary)]">Nie masz konta? </span>
          <Link to="/register" className="text-[var(--color-brand)] font-medium hover:underline">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </form>
  )
}
