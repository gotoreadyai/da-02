import { useNavigate } from 'react-router-dom'
import { User, Music, LogOut, Award, Calendar, Heart, Users, Star } from 'lucide-react'
import { useAuthStore } from '@/lib/auth'
import { useMyProfile, useMyDanceStyles } from '@/features/profile/api'
import { Avatar, PageHeader, ListRow, StatCard, Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON, LAYOUT } from '@/lib/constants'

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
    { icon: <User className={ICON.md} />, title: 'Dane osobowe', subtitle: 'Edytuj profil', onClick: () => navigate('/profile/edit') },
    { icon: <Music className={ICON.md} />, title: 'Style taneczne', subtitle: `${danceStyles?.length || 0} stylow`, onClick: () => navigate('/profile/dance-styles') },
    { icon: <Calendar className={ICON.md} />, title: 'Moje wydarzenia', subtitle: 'Historia i nadchodzace', onClick: () => navigate('/events') },
  ]

  return (
    <div>
      <PageHeader title="Profil" subtitle="Twoje konto">
        <div className={cn('card-premium p-4', ROUNDED.card)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className={cn('ring-4 ring-[var(--color-brand)]/30 shadow-lg', ROUNDED.circle)}>
                <Avatar src={profile.profile_photo_url} name={profile.name} size="xl" shape="circle" alt={`Zdjecie ${profile.name}`} />
              </div>
              {profile.is_verified && (
                <div className={cn('absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 border-3 border-[var(--color-bg-card)] flex items-center justify-center', ROUNDED.circle)} aria-label="Zweryfikowany">
                  <Award className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-display-md text-[var(--color-text-primary)] mb-1">{profile.name}</h2>
              {profile.is_trainer && (
                <span className="badge badge-brand"><Star className="w-3 h-3" />Trener</span>
              )}
            </div>
          </div>

          <div className="text-label text-[var(--color-text-tertiary)] mb-3">Twoja przygoda</div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard value={danceStyles?.length || 0} label="Style" icon={Music} />
            <StatCard value={0} label="Wydarzenia" icon={Calendar} />
            <StatCard value={0} label="Dopasowania" icon={Heart} />
            <StatCard value={0} label="Polaczenia" icon={Users} />
          </div>
        </div>
      </PageHeader>

      <section className={LAYOUT.section}>
        <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
          {menuItems.map((item, index) => (
            <ListRow
              key={item.title}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onClick={item.onClick}
              showChevron
              isLast={index === menuItems.length - 1}
            />
          ))}
        </div>
      </section>

      <section className={LAYOUT.sectionLast}>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut className={ICON.md} />
          Wyloguj
        </Button>
      </section>
    </div>
  )
}
