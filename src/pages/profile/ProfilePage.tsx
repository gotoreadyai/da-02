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
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { useMyProfile, useMyDanceStyles } from '@/features/profile/api'
import { getInitials } from '@/lib/utils'
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
      label: 'Informacje osobiste',
      onClick: () => navigate('/profile/edit'),
      color: 'text-brand-500',
      bgColor: 'bg-brand-100',
    },
    {
      icon: Music,
      label: 'Style taneczne',
      onClick: () => navigate('/profile/edit'),
      color: 'text-pink-500',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Calendar,
      label: 'Moje wydarzenia',
      onClick: () => navigate('/events'),
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
    },
    {
      icon: CreditCard,
      label: 'Historia platnosci',
      onClick: () => {},
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      icon: Crown,
      label: 'Plan subskrypcji',
      onClick: () => {},
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="min-h-screen pb-8">
      {/* Header with profile photo */}
      <div className="relative pt-14 pb-8 px-5">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-brand-500/10 via-pink-500/10 to-orange-500/10 rounded-b-[3rem]" />

        {/* Profile photo */}
        <div className="relative flex flex-col items-center">
          <div className="w-28 h-28 rounded-3xl bg-white shadow-card border-4 border-white overflow-hidden mb-4">
            {profile.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-400 to-accent-pink flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {getInitials(profile.name)}
                </span>
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {profile.is_verified && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                <Award className="w-3 h-3" />
                Zweryfikowany
              </span>
            )}
            {profile.is_trainer && (
              <span className="bg-purple-100 text-purple-600 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                <Star className="w-3 h-3" />
                Trener
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dance Journey Stats */}
      <div className="px-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Twoja podraz taneczna
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            value={danceStyles?.length || 0}
            label="Stylii tanca"
            icon={Music}
            color="brand"
          />
          <StatCard
            value={0}
            label="Wydarzen"
            icon={Calendar}
            color="pink"
          />
          <StatCard
            value={0}
            label="Polubien"
            icon={Heart}
            color="red"
          />
          <StatCard
            value={0}
            label="Dopasowan"
            icon={Users}
            color="green"
          />
        </div>
      </div>

      {/* Menu items */}
      <div className="px-5 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/20 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={cn(
                'w-full flex items-center gap-4 p-4 hover:bg-gray-50/50 active:bg-gray-100/50 transition-colors text-left',
                index !== menuItems.length - 1 && 'border-b border-gray-100'
              )}
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bgColor)}>
                <item.icon className={cn('w-5 h-5', item.color)} />
              </div>
              <span className="flex-1 font-medium text-gray-900">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Settings section */}
      <div className="px-5 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-card border border-white/20 overflow-hidden">
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50/50 active:bg-gray-100/50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <span className="flex-1 font-medium text-gray-900">Ustawienia</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout button */}
      <div className="px-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-2xl transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-red-500">Wyloguj sie</span>
        </button>
      </div>
    </div>
  )
}

// Stat card component
interface StatCardProps {
  value: number
  label: string
  icon: React.ElementType
  color: 'brand' | 'pink' | 'red' | 'green'
}

function StatCard({ value, label, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    brand: 'text-brand-600 bg-brand-100',
    pink: 'text-pink-600 bg-pink-100',
    red: 'text-red-600 bg-red-100',
    green: 'text-green-600 bg-green-100',
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colorClasses[color].split(' ')[1])}>
          <Icon className={cn('w-5 h-5', colorClasses[color].split(' ')[0])} />
        </div>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
