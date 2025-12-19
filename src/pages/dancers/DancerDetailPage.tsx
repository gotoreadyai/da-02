import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import {
  ArrowLeft,
  MapPin,
  Ruler,
  Calendar,
  Music,
  Award,
  GraduationCap,
  Heart,
  MessageCircle,
  Sparkles,
  Crown,
} from 'lucide-react'
import { useDancer, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { cn, formatDate, getSkillLevelLabel } from '@/lib/utils'

export function DancerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dancer, isLoading, isError } = useDancer(id!)
  const likeMutation = useLikeDancer()
  const unlikeMutation = useUnlikeDancer()

  const handleLike = () => {
    if (!dancer) return
    if (dancer.i_liked) {
      unlikeMutation.mutate(dancer.id)
    } else {
      likeMutation.mutate(dancer.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !dancer) {
    return (
      <div className="min-h-screen">
        <header className="px-6 pt-14 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <div className="card-premium p-8 text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h2 className="text-headline-md mb-2">Nie znaleziono profilu</h2>
            <button
              onClick={() => navigate('/dancers')}
              className="mt-4 px-6 py-3 rounded-2xl bg-[var(--color-brand)] text-white text-body-sm font-medium"
            >
              Wróć do listy
            </button>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Hero section with photo */}
      <div className="relative h-[28rem]">
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
            <span className="text-[8rem] font-light text-white/80">
              {dancer.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Status badges */}
        <div className="absolute top-14 right-6 flex flex-col gap-2">
          {dancer.is_matched && (
            <span className="badge badge-success shadow-lg">
              <Sparkles className="w-3 h-3" />
              MATCH
            </span>
          )}
          {!dancer.is_matched && dancer.liked_me && (
            <span className="badge badge-warning shadow-lg">
              <Heart className="w-3 h-3 fill-current" />
              LUBI CIĘ
            </span>
          )}
        </div>

        {/* Info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            {dancer.is_verified && (
              <span className="badge bg-blue-500 text-white text-[10px]">
                <Award className="w-3 h-3" />
                ZWERYFIKOWANY
              </span>
            )}
            {dancer.is_trainer && (
              <span className="badge badge-brand text-[10px]">
                <Crown className="w-3 h-3" />
                TRENER
              </span>
            )}
          </div>

          <h1 className="text-display-lg text-white mb-1">
            {dancer.name}
            {dancer.age && <span className="font-normal text-white/80">, {dancer.age}</span>}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/70 text-body-sm">
            {dancer.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {dancer.city}
              </span>
            )}
            {dancer.height && (
              <span className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                {dancer.height} cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 relative z-10">
        {/* Bio */}
        {dancer.bio && (
          <section className="mb-6">
            <div className="card-premium p-5">
              <h3 className="text-label text-[var(--color-text-tertiary)] mb-2">O MNIE</h3>
              <p className="text-body-md text-[var(--color-text-secondary)] whitespace-pre-wrap">
                {dancer.bio}
              </p>
            </div>
          </section>
        )}

        {/* Dance styles */}
        {dancer.dance_styles && dancer.dance_styles.length > 0 && (
          <section className="mb-6">
            <h2 className="text-headline-md mb-4">Style tańca</h2>
            <div className="card-premium overflow-hidden">
              {dancer.dance_styles.map((style, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-4 p-4',
                    index !== dancer.dance_styles!.length - 1 && 'border-b border-black/[0.04]'
                  )}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                    <Music className="w-5 h-5 text-[var(--color-brand-dark)]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-headline-sm block">{style.style_name}</span>
                    <span className="text-caption">{getSkillLevelLabel(style.skill_level)}</span>
                  </div>
                  {style.is_teaching && (
                    <span className="badge badge-brand">
                      <GraduationCap className="w-3 h-3" />
                      UCZY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Details */}
        <section className="mb-6">
          <h2 className="text-headline-md mb-4">Szczegóły</h2>
          <div className="card-premium p-4">
            <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
              <Calendar className="w-5 h-5" />
              <span className="text-body-sm">Dołączył {formatDate(dancer.created_at)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-headline-sm transition-all',
              dancer.i_liked
                ? 'bg-[var(--color-accent-coral)] text-white'
                : 'bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-black/[0.04]'
            )}
          >
            <Heart className={cn('w-5 h-5', dancer.i_liked && 'fill-current')} />
            {dancer.i_liked ? 'Polubiono' : 'Polub'}
          </button>

          <button
            disabled={!dancer.is_matched}
            onClick={() => navigate('/chat')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-headline-sm transition-all',
              dancer.is_matched
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)] border border-black/[0.04]'
            )}
          >
            <MessageCircle className="w-5 h-5" />
            {dancer.is_matched ? 'Napisz' : 'Dopasuj się'}
          </button>
        </div>
        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
