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
    <div className="min-h-screen bg-black flex justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-md min-h-screen bg-[var(--color-bg)] relative shadow-2xl overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 via-[#8B5CF6]/12 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C4B5A0]/8 to-[#D4A574]/15" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* Main content */}
        <main className="relative pb-24 min-h-screen overflow-y-auto">
          <Outlet />
        </main>

        {/* Premium Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-[var(--color-bg-card)] border-t border-white/[0.06]" />

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
                  isActive && 'bg-[var(--color-brand)]/20'
                )}
              >
                <Icon
                  className={cn(
                    ICON.lg,
                    'transition-colors duration-300',
                    isActive
                      ? 'text-[var(--color-brand)]'
                      : 'text-[var(--color-text-tertiary)]'
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium tracking-wide transition-colors duration-300',
                    isActive
                      ? 'text-[var(--color-brand)]'
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
          <div className="h-[env(safe-area-inset-bottom)] bg-[var(--color-bg-card)]/90" />
        </nav>
      </div>
    </div>
  )
}
