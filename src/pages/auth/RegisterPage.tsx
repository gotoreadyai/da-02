import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { List, ListInput, Button, Preloader } from 'konsta/react'
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Utwórz konto
      </h2>

      <List strongIos insetIos className="-mx-4 -mt-4">
        <ListInput
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        <ListInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <ListInput
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <ListInput
          type="password"
          placeholder="Potwierdź hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </List>

      <div className="mt-6 space-y-4">
        <Button
          large
          className="w-full !bg-brand-500 active:!bg-brand-600"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <Preloader size="w-5 h-5" className="text-white" />
          ) : (
            'Zarejestruj się'
          )}
        </Button>

        <div className="text-center text-gray-500 dark:text-gray-400">
          <span>Masz już konto? </span>
          <Link to="/login" className="text-brand-500 font-medium hover:underline">
            Zaloguj się
          </Link>
        </div>
      </div>
    </form>
  )
}
