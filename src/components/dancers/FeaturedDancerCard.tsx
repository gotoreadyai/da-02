import { MapPin } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { getGradientForName, ICON } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'

interface FeaturedDancerCardProps {
  dancer: PublicDancer
  onPress: () => void
  isActive?: boolean
}

export function FeaturedDancerCard({ dancer, onPress, isActive = false }: FeaturedDancerCardProps) {
  const gradient = getGradientForName(dancer.name)

  return (
    <button
      onClick={onPress}
      aria-label={`Zobacz profil ${dancer.name}`}
      className="relative w-full h-full group"
    >
      {/* GLOW */}
      <div
        className={cn(
          'absolute inset-0 rounded-[32px] blur-2xl transition-all duration-500',
          `bg-gradient-to-br ${gradient}`,
          isActive ? 'opacity-60 scale-110' : 'opacity-30 scale-100'
        )}
        style={{ transform: 'translateY(8%)' }}
      />

      {/* Karta */}
      <div className={cn(
        'relative h-full',
        'rounded-[32px]',
        `bg-gradient-to-br ${gradient}`,
        'shadow-[0_8px_40px_rgba(0,0,0,0.3)]',
        'p-[3px]',
        'transition-transform duration-300',
        'group-active:scale-[0.98]'
      )}>
        {/* Inner card with photo */}
        <div className="relative w-full h-full rounded-[29px] overflow-hidden bg-black">
          {/* Photo */}
          {dancer.profile_photo_url ? (
            <img
              src={dancer.profile_photo_url}
              alt={`Zdjęcie ${dancer.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className={cn(
              'absolute inset-0 flex items-center justify-center',
              `bg-gradient-to-br ${gradient}`
            )}>
              <span className="text-7xl font-bold text-white/20 select-none">
                {getInitials(dancer.name || '?')}
              </span>
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 via-30% to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
            <h3 className="text-2xl font-bold text-white truncate">
              {dancer.name}
            </h3>

            <div className="flex items-center justify-center gap-1.5 mt-1 text-white/70">
              <MapPin className={cn(ICON.xs)} />
              <span className="text-sm">{dancer.city || 'W pobliżu'}</span>
            </div>

            {dancer.dance_styles?.[0] && (
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-white/10 text-xs text-white/90 font-medium backdrop-blur-sm">
                {dancer.dance_styles[0].style_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
