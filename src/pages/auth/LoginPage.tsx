import { useState } from 'react'
import { Link } from 'react-router-dom'
import { List, ListInput, Button, Preloader } from 'konsta/react'
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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Zaloguj się
      </h2>

      <List strongIos insetIos className="-mx-4 -mt-4">
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
            'Zaloguj się'
          )}
        </Button>

        <div className="text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-brand-500 hover:underline"
          >
            Zapomniałeś hasła?
          </Link>
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400">
          <span>Nie masz konta? </span>
          <Link to="/register" className="text-brand-500 font-medium hover:underline">
            Zarejestruj się
          </Link>
        </div>
      </div>
    </form>
  )
}
