import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner, InputField } from '@/components/ui'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'
import { SPACING, BUTTON, ICON } from '@/lib/constants'

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
      <h2 className="text-headline-lg text-center mb-5">Zaloguj się</h2>

      <div className={`${SPACING.stack} mb-5`}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          disabled={isLoading}
          icon={<Mail className={ICON.md} />}
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Hasło"
          disabled={isLoading}
          icon={<Lock className={ICON.md} />}
        />
      </div>

      <div className={SPACING.stack}>
        <button type="submit" disabled={isLoading} className={BUTTON.primary}>
          {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Zaloguj się'}
        </button>

        <div className="text-center">
          <Link to="/forgot-password" className="text-body-sm text-[var(--color-brand)] hover:underline">
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
