import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { User, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth'

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
      <h2 className="text-headline-lg text-center mb-6">Utwórz konto</h2>

      <div className="space-y-4 mb-6">
        {/* Name */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <User className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Imię"
            disabled={isLoading}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--color-bg)] text-body-md outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] transition-all"
          />
        </div>

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

        {/* Confirm Password */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Potwierdź hasło"
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
