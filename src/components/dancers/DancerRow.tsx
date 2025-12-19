import { MapPin, Heart, Sparkles, Award, GraduationCap } from 'lucide-react'
import { Avatar, ListRow, IconBox } from '@/components/ui'
import { cn } from '@/lib/utils'
import { BADGE, AVATAR_SIZE, ICON } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'

interface DancerRowProps {
  dancer: PublicDancer
  onPress: () => void
  onLike: (e: React.MouseEvent) => void
  isLast: boolean
}

export function DancerRow({ dancer, onPress, onLike, isLast }: DancerRowProps) {
  const avatarWithBadge = (
    <div className="relative flex-shrink-0">
      <Avatar
        src={dancer.profile_photo_url}
        name={dancer.name}
        size={AVATAR_SIZE.listRow}
        shape="rounded"
        alt={`Zdjecie profilowe ${dancer.name}`}
      />
      {dancer.is_matched && (
        <div className={cn('absolute -bottom-0.5 -right-0.5 border-2 border-white flex items-center justify-center bg-[var(--color-accent-mint)]', BADGE.indicator)}>
          <Sparkles className={ICON.xxs} style={{ color: 'white' }} />
        </div>
      )}
      {!dancer.is_matched && dancer.liked_me && (
        <div className={cn('absolute -bottom-0.5 -right-0.5 border-2 border-white flex items-center justify-center bg-[var(--color-accent-hot)]', BADGE.indicator)}>
          <Heart className={cn(ICON.xxs, 'text-white fill-current')} />
        </div>
      )}
    </div>
  )

  const titleWithBadges = (
    <div className="flex items-center gap-2 mb-0.5">
      <span className="text-headline-sm truncate">{dancer.name}</span>
      {dancer.is_verified && <Award className={cn(ICON.sm, 'text-blue-500 flex-shrink-0')} />}
      {dancer.is_trainer && <GraduationCap className={cn(ICON.sm, 'text-[var(--color-brand)] flex-shrink-0')} />}
    </div>
  )

  const subtitleWithDetails = (
    <div className="flex items-center gap-2 text-caption text-xs">
      {dancer.dance_styles?.[0] && (
        <span className="text-[var(--color-brand)] font-medium">{dancer.dance_styles[0].style_name}</span>
      )}
      {dancer.age && <span>· {dancer.age}</span>}
      {dancer.city && (
        <span className="flex items-center gap-1 truncate">
          · <MapPin className={ICON.xxs} />{dancer.city}
        </span>
      )}
    </div>
  )

  const likeButton = (
    <IconBox
      size="sm"
      variant={dancer.i_liked ? 'accent' : 'muted'}
      className="cursor-pointer"
      onClick={onLike}
      aria-label={dancer.i_liked ? `Cofnij polubienie ${dancer.name}` : `Polub ${dancer.name}`}
      aria-pressed={dancer.i_liked}
    >
      <Heart className={cn(ICON.sm, dancer.i_liked && 'fill-current')} />
    </IconBox>
  )

  return (
    <ListRow
      icon={avatarWithBadge}
      rawIcon
      title={dancer.name}
      titleElement={titleWithBadges}
      subtitleElement={subtitleWithDetails}
      rightElement={likeButton}
      onClick={onPress}
      isLast={isLast}
      as="div"
    />
  )
}
