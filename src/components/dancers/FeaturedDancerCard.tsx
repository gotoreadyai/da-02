import { Zap } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { getGradientForName, ROUNDED, ICON, FEATURED_CARD } from '@/lib/constants'
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
      className={cn(FEATURED_CARD.base, FEATURED_CARD.dancer)}
    >
      <div className={cn(
        'relative aspect-[4/5] overflow-hidden p-4 flex flex-col items-center justify-center',
        ROUNDED.card,
        `bg-gradient-to-br ${gradient}`
      )}>
        {/* Circular avatar */}
        <div className={cn('w-24 h-24 mb-4 overflow-hidden shadow-lg', ROUNDED.circle)}>
          {dancer.profile_photo_url ? (
            <img
              src={dancer.profile_photo_url}
              alt={`Zdjecie profilowe ${dancer.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-white/60 select-none" aria-hidden="true">
                {getInitials(dancer.name || '?')}
              </span>
            </div>
          )}
        </div>

        {/* Name - serif font */}
        <h3 className="text-display-md text-white text-center leading-tight truncate w-full px-2">
          {dancer.name}
        </h3>

        {/* Distance indicator */}
        <div className="flex items-center gap-1 mt-2">
          <Zap className={cn(ICON.xs, 'text-white/70')} />
          <span className="text-xs text-white/70">
            {dancer.city || '10.3M'}
          </span>
        </div>
      </div>
    </button>
  )
}
