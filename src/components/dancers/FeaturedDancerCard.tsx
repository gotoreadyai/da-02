import { MapPin, Heart, Sparkles, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getGradientForName, ROUNDED, BADGE, ICON } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'

interface FeaturedDancerCardProps {
  dancer: PublicDancer
  onPress: () => void
}

export function FeaturedDancerCard({ dancer, onPress }: FeaturedDancerCardProps) {
  const gradient = getGradientForName(dancer.name)

  return (
    <button
      onClick={onPress}
      aria-label={`Zobacz profil ${dancer.name}`}
      className="flex-shrink-0 w-52 text-left active:scale-[0.97] transition-transform"
    >
      <div className={cn(
        'relative aspect-[4/5] overflow-hidden shadow-md',
        ROUNDED.card,
        !dancer.profile_photo_url && `bg-gradient-to-br ${gradient}`
      )}>
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={`Zdjecie profilowe ${dancer.name}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/15 select-none" aria-hidden="true">
              {dancer.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        {dancer.is_matched ? (
          <div className={cn('absolute top-2 right-2', BADGE.icon, 'bg-[var(--color-accent-mint)]')}>
            <Sparkles className={cn(ICON.xs, 'text-white')} />
          </div>
        ) : dancer.liked_me ? (
          <div className={cn('absolute top-2 right-2', BADGE.icon, 'bg-[var(--color-accent-hot)]')}>
            <Heart className={cn(ICON.xs, 'text-white fill-current')} />
          </div>
        ) : dancer.is_trainer ? (
          <div className={cn('absolute top-2 right-2', BADGE.icon, 'bg-[var(--color-brand)]')}>
            <Crown className={cn(ICON.xs, 'text-white')} />
          </div>
        ) : null}

        {/* Info */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">
            {dancer.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-white/50" />
            <span className="text-[10px] text-white/60 truncate">
              {dancer.city || 'Polska'}
              {dancer.age && `, ${dancer.age}`}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
