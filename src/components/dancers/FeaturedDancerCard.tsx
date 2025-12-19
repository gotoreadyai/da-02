import { MapPin } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { getGradientForStatus, ICON } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'

interface FeaturedDancerCardProps {
  dancer: PublicDancer
  onPress: () => void
  isActive?: boolean
}

export function FeaturedDancerCard({ dancer, onPress, isActive = false }: FeaturedDancerCardProps) {
  const gradient = getGradientForStatus(dancer)

  return (
    <button
      onClick={onPress}
      aria-label={`Zobacz profil ${dancer.name}`}
      className="relative w-full h-full group"
    >
      {/* Skupiony GLOW pod kartą */}
      <div
        className={cn(
          'absolute inset-x-2 -bottom-4 h-24 rounded-full blur-xl transition-all duration-500',
          `bg-gradient-to-r ${gradient}`,
          isActive ? 'opacity-90' : 'opacity-60'
        )}
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
          {/* Status dot */}
          {(dancer.is_matched || dancer.liked_me || dancer.is_trainer || dancer.i_liked || dancer.is_verified) && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
              <div className={cn(
                'w-2 h-2 rounded-full',
                dancer.is_matched && 'bg-emerald-400',
                !dancer.is_matched && dancer.liked_me && 'bg-rose-400',
                !dancer.is_matched && !dancer.liked_me && dancer.is_trainer && 'bg-violet-400',
                !dancer.is_matched && !dancer.liked_me && !dancer.is_trainer && dancer.i_liked && 'bg-amber-400',
                !dancer.is_matched && !dancer.liked_me && !dancer.is_trainer && !dancer.i_liked && dancer.is_verified && 'bg-blue-400'
              )} />
              <span className="text-[10px] text-white/90 font-medium">
                {dancer.is_matched ? 'Match' :
                 dancer.liked_me ? 'Lubi Cię' :
                 dancer.is_trainer ? 'Trener' :
                 dancer.i_liked ? 'Lubisz' :
                 'Verified'}
              </span>
            </div>
          )}

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

          {/* Top shine / błysk */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none" />

          {/* Edge highlight */}
          <div className="absolute inset-0 rounded-[29px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none" />

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
