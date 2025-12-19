import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types/database'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (authError) {
            return { success: false, error: getErrorMessage(authError.message) }
          }

          if (!authData.user) {
            return { success: false, error: 'Nie udało się zalogować' }
          }

          // Fetch user profile from public.users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()

          if (userError || !userData) {
            return { success: false, error: 'Nie znaleziono profilu użytkownika' }
          }

          set({ user: userData, isAuthenticated: true })
          return { success: true }
        } catch (error) {
          return { success: false, error: 'Wystąpił błąd podczas logowania' }
        }
      },

      register: async (email, password, name) => {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name },
            },
          })

          if (authError) {
            return { success: false, error: getErrorMessage(authError.message) }
          }

          if (!authData.user) {
            return { success: false, error: 'Nie udało się utworzyć konta' }
          }

          // User profile will be created by database trigger
          return { success: true }
        } catch (error) {
          return { success: false, error: 'Wystąpił błąd podczas rejestracji' }
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      refreshUser: async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser()
          
          if (!authUser) {
            set({ user: null, isAuthenticated: false, isLoading: false })
            return
          }

          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          set({ 
            user: userData || null, 
            isAuthenticated: !!userData,
            isLoading: false 
          })
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      forgotPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          })

          if (error) {
            return { success: false, error: getErrorMessage(error.message) }
          }

          return { success: true }
        } catch (error) {
          return { success: false, error: 'Wystąpił błąd' }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Error message translations
function getErrorMessage(message: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Nieprawidłowy email lub hasło',
    'Email not confirmed': 'Email nie został potwierdzony',
    'User already registered': 'Użytkownik już istnieje',
    'Password should be at least 6 characters': 'Hasło musi mieć minimum 6 znaków',
    'Unable to validate email address: invalid format': 'Nieprawidłowy format email',
  }
  return errorMap[message] || message
}

// Initialize auth state on app load
export async function initializeAuth() {
  const { refreshUser } = useAuthStore.getState()
  await refreshUser()

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await refreshUser()
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null)
    }
  })
}
