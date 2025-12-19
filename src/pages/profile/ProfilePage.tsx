import { useNavigate } from 'react-router-dom'
import {
  User,
  Music,
  Settings,
  LogOut,
  ChevronRight,
  Award,
  Calendar,
  Heart,
  Users,
  Star,
  CreditCard,
  Crown,
  Bell,
  Shield,
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { useMyProfile, useMyDanceStyles } from '@/features/profile/api'
import { Avatar } from '@/components/ui/Avatar'
import { StatCard } from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'

export function ProfilePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const { data: profile } = useMyProfile()
  const { data: danceStyles } = useMyDanceStyles()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (!profile) return null

  const menuItems = [
    {
      icon: User,
      label: 'Personal Information',
      description: 'Update your details',
      onClick: () => navigate('/profile/edit'),
    },
    {
      icon: Music,
      label: 'Dance Information',
      description: 'Styles and preferences',
      onClick: () => navigate('/profile/edit'),
    },
    {
      icon: Calendar,
      label: 'My Events',
      description: 'View your events',
      onClick: () => navigate('/events'),
    },
    {
      icon: CreditCard,
      label: 'Payment History',
      description: 'Transactions and receipts',
      onClick: () => {},
    },
    {
      icon: Crown,
      label: 'Subscription Plan',
      description: 'Manage your plan',
      onClick: () => {},
    },
  ]

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-14 pb-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-headline-lg">Profile</h1>
          <button
            aria-label="Ustawienia"
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="card-premium p-6">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="ring-4 ring-[var(--color-brand-light)] shadow-lg rounded-full">
                <Avatar
                  src={profile.profile_photo_url}
                  name={profile.name}
                  size="xl"
                  shape="circle"
                  alt={`Zdjęcie profilowe ${profile.name}`}
                />
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 border-3 border-white flex items-center justify-center" aria-label="Zweryfikowany">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name & badges */}
            <div className="flex-1">
              <h2 className="text-display-md text-[var(--color-text-primary)] mb-1">
                {profile.name}
              </h2>
              <div className="flex items-center gap-2">
                {profile.is_trainer && (
                  <span className="badge badge-brand">
                    <Star className="w-3 h-3" />
                    Trainer
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="text-label text-[var(--color-text-tertiary)] mb-3">
            Your Dance Journey
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={danceStyles?.length || 0} label="Dance Styles" icon={Music} />
            <StatCard value={0} label="Events" icon={Calendar} />
            <StatCard value={0} label="Matches" icon={Heart} />
            <StatCard value={0} label="Connections" icon={Users} />
          </div>
        </div>
      </header>

      {/* Menu Items */}
      <section className="px-6 mb-6">
        <div className="card-premium overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                'w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left',
                index !== menuItems.length - 1 && 'border-b border-black/[0.04]'
              )}
            >
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                <item.icon className="w-5 h-5 text-[var(--color-brand-dark)]" />
              </div>
              <div className="flex-1">
                <span className="text-headline-sm block mb-0.5">{item.label}</span>
                <span className="text-caption">{item.description}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
            </button>
          ))}
        </div>
      </section>

      {/* Settings Section */}
      <section className="px-6 mb-6">
        <div className="card-premium overflow-hidden">
          <button className="w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left border-b border-black/[0.04]">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block mb-0.5">Notifications</span>
              <span className="text-caption">Manage alerts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </button>
          <button className="w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block mb-0.5">Privacy & Security</span>
              <span className="text-caption">Account settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          </button>
        </div>
      </section>

      {/* Logout */}
      <section className="px-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="text-headline-sm text-red-500">Sign Out</span>
        </button>
      </section>
    </div>
  )
}
