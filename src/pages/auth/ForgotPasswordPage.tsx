import { useState } from 'react'
import { Link } from 'react-router-dom'
import { List, ListInput, Button, Preloader } from 'konsta/react'
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
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <span className="text-3xl">✉️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sprawdź email
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Wysłaliśmy link do resetowania hasła na adres {email}
        </p>
        <Link to="/login">
          <Button large className="w-full !bg-brand-500 active:!bg-brand-600">
            Wróć do logowania
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        Resetuj hasło
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
        Podaj email, a wyślemy Ci link do resetowania hasła
      </p>

      <List strongIos insetIos className="-mx-4 -mt-4">
        <ListInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            'Wyślij link'
          )}
        </Button>

        <div className="text-center">
          <Link to="/login" className="text-brand-500 font-medium hover:underline">
            Wróć do logowania
          </Link>
        </div>
      </div>
    </form>
  )
}
