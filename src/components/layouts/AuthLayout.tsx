import { Outlet } from 'react-router-dom'
import { Page } from 'konsta/react'

export function AuthLayout() {
  return (
    <Page className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
      <div className="min-h-screen flex flex-col">
        {/* Logo area */}
        <div className="flex-1 flex items-center justify-center px-6 pt-safe">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                <span className="text-4xl">💃</span>
              </div>
              <h1 className="text-3xl font-bold text-white">DanceMatch</h1>
              <p className="text-white/80 mt-2">Znajdź swojego partnera do tańca</p>
            </div>

            {/* Auth form container */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6">
              <Outlet />
            </div>
          </div>
        </div>

        {/* Bottom safe area padding */}
        <div className="pb-safe" />
      </div>
    </Page>
  )
}
