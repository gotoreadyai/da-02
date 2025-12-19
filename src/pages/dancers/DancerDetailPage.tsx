import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { ArrowLeft, MapPin, Ruler, Music, Award, Heart, MessageCircle, Sparkles, Crown } from 'lucide-react'
import { useDancer, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useGetOrCreateConversation } from '@/features/chat/api'
import { cn, getSkillLevelLabel, getInitials } from '@/lib/utils'
import { getGradientForName, ROUNDED, ICON, ICON_CONTAINER, LIST_ITEM, BADGE, LAYOUT, GAP } from '@/lib/constants'

export function DancerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dancer, isLoading, isError } = useDancer(id!)
  const likeMutation = useLikeDancer()
  const unlikeMutation = useUnlikeDancer()
  const getOrCreateConversation = useGetOrCreateConversation()

  const handleLike = () => {
    if (!dancer) return
    if (dancer.i_liked) {
      unlikeMutation.mutate(dancer.id)
    } else {
      likeMutation.mutate(dancer.id)
    }
  }

  const handleMessage = () => {
    if (!dancer) return
    getOrCreateConversation.mutate(dancer.id, {
      onSuccess: (conversationId) => {
        navigate(`/chat/${conversationId}`)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !dancer) {
    return (
      <div className="px-5 pt-13">
        <button
          onClick={() => navigate(-1)}
          aria-label="Wroc"
          className={cn(ICON_CONTAINER.md, 'bg-white shadow-sm flex items-center justify-center mb-5', ROUNDED.avatarRounded)}
        >
          <ArrowLeft className={ICON.md} />
        </button>
        <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
          <span className="text-4xl mb-3 block">😕</span>
          <h2 className="text-headline-md mb-1">Nie znaleziono</h2>
          <p className="text-caption mb-4">Ten profil nie istnieje</p>
          <button onClick={() => navigate('/dancers')} className={cn('px-5 py-3 bg-[var(--color-brand)] text-white text-ui', ROUNDED.button)}>
            Wroc
          </button>
        </div>
      </div>
    )
  }

  const gradient = getGradientForName(dancer.name)

  return (
    <div className="bg-[var(--color-bg)] pb-36">
      {/* Hero */}
      <div className="relative h-[75vh] min-h-[480px] max-h-[640px]">
        {dancer.profile_photo_url ? (
          <img src={dancer.profile_photo_url} alt={`Zdjecie profilowe ${dancer.name}`} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={cn('absolute inset-0', `bg-gradient-to-br ${gradient}`)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10rem] font-bold text-white/10 select-none tracking-tighter" aria-hidden="true">
                {getInitials(dancer.name || '?')}
              </span>
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-13 px-5 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            aria-label="Wroc"
            className={cn(ICON_CONTAINER.md, 'bg-black/20 backdrop-blur-md flex items-center justify-center', ROUNDED.avatarRounded)}
          >
            <ArrowLeft className={cn(ICON.md, 'text-white')} />
          </button>

          {/* Badges */}
          <div className={cn('flex flex-col', GAP.sm)}>
            {dancer.is_matched && (
              <div className={cn(BADGE.standard, 'bg-[var(--color-accent-mint)] flex items-center gap-1')}>
                <Sparkles className={cn(ICON.xs, 'text-white')} />
                <span className="text-white tracking-wider">MATCH</span>
              </div>
            )}
            {!dancer.is_matched && dancer.liked_me && (
              <div className={cn(BADGE.standard, 'bg-[var(--color-accent-hot)] flex items-center gap-1')}>
                <Heart className={cn(ICON.xs, 'text-white fill-current')} />
                <span className="text-white tracking-wider">LUBI CIE</span>
              </div>
            )}
            {dancer.is_trainer && (
              <div className={cn(BADGE.icon, 'bg-[var(--color-brand)]')}>
                <Crown className={cn(ICON.xs, 'text-white')} />
              </div>
            )}
            {dancer.is_verified && (
              <div className={cn(BADGE.icon, 'bg-blue-500')}>
                <Award className={cn(ICON.xs, 'text-white')} />
              </div>
            )}
          </div>
        </div>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-display-lg text-white tracking-tight">
            {dancer.name}
            {dancer.age && <span className="font-normal text-white/60 ml-2">{dancer.age}</span>}
          </h1>

          <div className={cn('flex items-center mt-1', GAP.md)}>
            {dancer.city && (
              <span className={cn('flex items-center text-white/60 text-sm', GAP.xs)}>
                <MapPin className={ICON.xs} />
                {dancer.city}
              </span>
            )}
            {dancer.height && (
              <span className={cn('flex items-center text-white/60 text-sm', GAP.xs)}>
                <Ruler className={ICON.xs} />
                {dancer.height}cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={LAYOUT.section}>
        {/* Bio */}
        {dancer.bio && (
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed py-3">
            {dancer.bio}
          </p>
        )}

        {/* Dance styles */}
        {dancer.dance_styles && dancer.dance_styles.length > 0 && (
          <div className={cn('card-premium overflow-hidden mt-5', ROUNDED.card)}>
            {dancer.dance_styles.map((style, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center',
                  LIST_ITEM.padding,
                  idx !== dancer.dance_styles!.length - 1 && LIST_ITEM.border
                )}
              >
                <div className={cn(ICON_CONTAINER.sm, 'bg-[var(--color-brand-lighter)] flex items-center justify-center')}>
                  <Music className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-headline-sm block truncate">{style.style_name}</span>
                  <span className="text-caption text-xs">{getSkillLevelLabel(style.skill_level)}</span>
                </div>
                {style.is_teaching && (
                  <div className={cn(BADGE.inline, 'bg-[var(--color-brand-lighter)] text-[var(--color-brand)]')}>
                    UCZY
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating actions */}
      <div className={LAYOUT.floatingAction}>
        <div className={cn('flex max-w-md mx-auto', GAP.md)} role="group" aria-label="Akcje profilu">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            aria-label={dancer.i_liked ? 'Cofnij polubienie' : 'Polub'}
            aria-pressed={dancer.i_liked}
            className={cn(
              'flex-1 flex items-center justify-center py-4 font-semibold shadow-lg transition-all',
              GAP.sm,
              ROUNDED.button,
              dancer.i_liked ? 'bg-[var(--color-accent-hot)] text-white' : 'bg-white text-[var(--color-text-primary)]'
            )}
          >
            <Heart className={cn(ICON.md, dancer.i_liked && 'fill-current')} />
            <span className="text-sm">{dancer.i_liked ? 'Lubisz' : 'Polub'}</span>
          </button>

          <button
            disabled={!dancer.is_matched || getOrCreateConversation.isPending}
            onClick={handleMessage}
            aria-label={dancer.is_matched ? 'Napisz wiadomosc' : 'Najpierw musisz sie dopasowac'}
            className={cn(
              'flex-1 flex items-center justify-center py-4 font-semibold shadow-lg transition-all',
              GAP.sm,
              ROUNDED.button,
              dancer.is_matched ? 'bg-[var(--color-brand)] text-white' : 'bg-white/60 text-[var(--color-text-tertiary)]'
            )}
          >
            <MessageCircle className={ICON.md} />
            <span className="text-sm">
              {getOrCreateConversation.isPending ? 'Otwieranie...' : dancer.is_matched ? 'Napisz' : 'Dopasuj'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
