import { MapPin, Heart, Sparkles, Award, GraduationCap } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import type { PublicDancer } from '@/types/database'

interface DancerRowProps {
  dancer: PublicDancer
  onPress: () => void
  onLike: (e: React.MouseEvent) => void
  isLast: boolean
}

export function DancerRow({ dancer, onPress, onLike, isLast }: DancerRowProps) {
  return (
    <div
      onClick={onPress}
      role="button"
      tabIndex={0}
      aria-label={`Zobacz profil ${dancer.name}`}
      onKeyDown={(e) => e.key === 'Enter' && onPress()}
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left cursor-pointer',
        !isLast && 'border-b border-black/[0.03]'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar
          src={dancer.profile_photo_url}
          name={dancer.name}
          size="md"
          shape="rounded"
          alt={`Zdjęcie profilowe ${dancer.name}`}
        />
        {dancer.is_matched && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md bg-[var(--color-accent-mint)] border-2 border-white flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        )}
        {!dancer.is_matched && dancer.liked_me && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-md bg-[var(--color-accent-hot)] border-2 border-white flex items-center justify-center">
            <Heart className="w-2 h-2 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-headline-sm truncate">{dancer.name}</span>
          {dancer.is_verified && <Award className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
          {dancer.is_trainer && <GraduationCap className="w-3.5 h-3.5 text-[var(--color-brand)] flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 text-caption text-xs">
          {dancer.dance_styles?.[0] && (
            <span className="text-[var(--color-brand)] font-medium">{dancer.dance_styles[0].style_name}</span>
          )}
          {dancer.age && <span>· {dancer.age}</span>}
          {dancer.city && (
            <span className="flex items-center gap-0.5 truncate">
              · <MapPin className="w-2.5 h-2.5" />{dancer.city}
            </span>
          )}
        </div>
      </div>

      {/* Like */}
      <button
        onClick={onLike}
        aria-label={dancer.i_liked ? `Cofnij polubienie ${dancer.name}` : `Polub ${dancer.name}`}
        aria-pressed={dancer.i_liked}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
          dancer.i_liked
            ? 'bg-[var(--color-accent-hot)]/10 text-[var(--color-accent-hot)]'
            : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)]'
        )}
      >
        <Heart className={cn('w-4 h-4', dancer.i_liked && 'fill-current')} />
      </button>
    </div>
  )
}
