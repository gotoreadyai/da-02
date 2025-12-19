import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ICON } from '@/lib/constants'

const tabs = [
  { path: '/dancers', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Czat' },
  { path: '/events', icon: Calendar, label: 'Wydarzenia' },
  { path: '/profile', icon: User, label: 'Profil' },
]

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const getActiveTab = () => {
    const index = tabs.findIndex((tab) => location.pathname.startsWith(tab.path))
    return index >= 0 ? index : 0
  }

  const activeTab = getActiveTab()

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <main className="pb-24">
        <Outlet />
      </main>

      {/* Premium Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Gradient blur background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-black/[0.04]" />

        {/* Navigation items */}
        <div className="relative flex items-center justify-around px-4 py-3">
          {tabs.map((tab, index) => {
            const isActive = activeTab === index
            const Icon = tab.icon

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-300',
                  isActive && 'bg-[var(--color-brand-light)]'
                )}
              >
                <Icon
                  className={cn(
                    ICON.lg,
                    'transition-colors duration-300',
                    isActive
                      ? 'text-[var(--color-brand-dark)]'
                      : 'text-[var(--color-text-tertiary)]'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium tracking-wide transition-colors duration-300',
                    isActive
                      ? 'text-[var(--color-brand-dark)]'
                      : 'text-[var(--color-text-tertiary)]'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Safe area spacer for iOS */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white/80" />
      </nav>
    </div>
  )
}
