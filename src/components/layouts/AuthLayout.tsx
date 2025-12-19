import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LOGO, ROUNDED } from '@/lib/constants'

export function AuthLayout() {
  return (
    <div className="min-h-screen gradient-brand">
      <div className="min-h-screen flex flex-col">
        {/* Logo area */}
        <div className="flex-1 flex items-center justify-center px-6 pt-14">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className={cn('inline-flex items-center justify-center bg-white/20 backdrop-blur-md mb-4', LOGO.container)}>
                <span className="text-4xl">💃</span>
              </div>
              <h1 className="text-display-lg text-white">DanceMatch</h1>
              <p className="text-body-md text-white/80 mt-2">Znajdz swojego partnera do tanca</p>
            </div>

            {/* Auth form container */}
            <div className={cn('card-premium p-6', ROUNDED.card)}>
              <Outlet />
            </div>
          </div>
        </div>

        {/* Bottom safe area padding */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
