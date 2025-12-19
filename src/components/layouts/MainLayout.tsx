import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, Calendar, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { path: '/dancers', icon: Home, label: 'Home' },
  { path: '/events', icon: Calendar, label: 'Wydarzenia' },
  { path: '/chat', icon: MessageCircle, label: 'Czat' },
  { path: '/profile', icon: User, label: 'Profil' },
]

export function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const activeTab = tabs.findIndex(
    (tab) => location.pathname.startsWith(tab.path)
  )

  return (
    <div className="min-h-screen">
      {/* Main content */}
      <div className="pb-24">
        <Outlet />
      </div>

      {/* Modern bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-card border border-white/20 px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index
              const Icon = tab.icon

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-brand-500 to-accent-pink text-white shadow-lg'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-white')} />
                  <span className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-white' : 'text-gray-500'
                  )}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
