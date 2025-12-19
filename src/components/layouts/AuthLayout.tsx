import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUNDED } from '@/lib/constants'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-black flex justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-md min-h-screen bg-[var(--color-bg)] relative shadow-2xl">
        {/* Gradient overlay - matching MainLayout */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 via-[#8B5CF6]/12 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C4B5A0]/8 to-[#D4A574]/15" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative min-h-screen flex flex-col">
        {/* Logo area */}
        <div className="flex-1 flex items-center justify-center px-6 pt-14">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-10">
              <h1 className="text-[var(--color-text-primary)]" style={{
                fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}>
                DanceMatch
              </h1>
              <p className="text-body-sm text-[var(--color-text-tertiary)] mt-3 tracking-widest uppercase">Znajdź partnera do tańca</p>
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
    </div>
  )
}
