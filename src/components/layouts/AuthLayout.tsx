import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC]">
      <div className="min-h-screen flex flex-col">
        {/* Logo area */}
        <div className="flex-1 flex items-center justify-center px-6 pt-14">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-md mb-4">
                <span className="text-4xl">💃</span>
              </div>
              <h1 className="text-display-lg text-white">DanceMatch</h1>
              <p className="text-body-md text-white/80 mt-2">Znajdź swojego partnera do tańca</p>
            </div>

            {/* Auth form container */}
            <div className="card-premium p-6">
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
