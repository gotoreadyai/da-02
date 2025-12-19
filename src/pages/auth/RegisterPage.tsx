import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner, InputField } from '@/components/ui'
import { User, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'
import { SPACING, BUTTON, ICON } from '@/lib/constants'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const register = useAuthStore((state) => state.register)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Wypełnij wszystkie pola')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne')
      return
    }

    if (password.length < 6) {
      toast.error('Hasło musi mieć minimum 6 znaków')
      return
    }

    setIsLoading(true)
    const result = await register(email, password, name)
    setIsLoading(false)

    if (result.success) {
      toast.success('Konto utworzone! Sprawdź email aby potwierdzić.')
      navigate('/login')
    } else {
      toast.error(result.error || 'Błąd rejestracji')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-headline-lg text-center mb-5">Utwórz konto</h2>

      <div className={`${SPACING.stack} mb-5`}>
        <InputField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Imię"
          disabled={isLoading}
          icon={<User className={ICON.md} />}
        />
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
        <InputField
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Potwierdź hasło"
          disabled={isLoading}
          icon={<Lock className={ICON.md} />}
        />
      </div>

      <div className={SPACING.stack}>
        <button type="submit" disabled={isLoading} className={BUTTON.primary}>
          {isLoading ? <Spinner size="sm" className="border-white border-t-transparent" /> : 'Zarejestruj się'}
        </button>

        <div className="text-center text-caption">
          <span className="text-[var(--color-text-secondary)]">Masz już konto? </span>
          <Link to="/login" className="text-[var(--color-brand)] font-medium hover:underline">
            Zaloguj się
          </Link>
        </div>
      </div>
    </form>
  )
}
