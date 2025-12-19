import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import {
  ArrowLeft,
  MapPin,
  Ruler,
  Music,
  Award,
  Heart,
  MessageCircle,
  Sparkles,
  Crown,
} from 'lucide-react'
import { useDancer, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useGetOrCreateConversation } from '@/features/chat/api'
import { cn, getSkillLevelLabel, getInitials } from '@/lib/utils'

// 2026 Gradient palette - ELECTRIC
const gradients = [
  'from-[#8B5CF6] via-[#EC4899] to-[#F97316]', // Sunset violet
  'from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]', // Ocean to violet
  'from-[#F97316] via-[#EF4444] to-[#EC4899]', // Fire
  'from-[#10B981] via-[#06B6D4] to-[#3B82F6]', // Teal dream
  'from-[#EC4899] via-[#8B5CF6] to-[#06B6D4]', // Pink to cyan
  'from-[#FBBF24] via-[#F97316] to-[#EF4444]', // Gold fire
]

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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !dancer) {
    return (
      <div className="min-h-screen px-4 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="card-premium p-6 text-center">
          <span className="text-4xl mb-3 block">😕</span>
          <h2 className="text-headline-md mb-1">Nie znaleziono</h2>
          <p className="text-caption mb-4">Ten profil nie istnieje</p>
          <button
            onClick={() => navigate('/dancers')}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-white text-ui"
          >
            Wróć
          </button>
        </div>
      </div>
    )
  }

  const gradientIndex = (dancer.name?.charCodeAt(0) || 0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-36">
      {/* HERO - Full viewport impact */}
      <div className="relative h-[75vh] min-h-[480px] max-h-[640px]">
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={cn('absolute inset-0', `bg-gradient-to-br ${gradient}`)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10rem] font-bold text-white/10 select-none tracking-tighter">
                {getInitials(dancer.name || '?')}
              </span>
            </div>
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-12 px-4 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Badges stack */}
          <div className="flex flex-col gap-1.5">
            {dancer.is_matched && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-accent-mint)]">
                <Sparkles className="w-3 h-3 text-white" />
                <span className="text-[9px] font-bold text-white tracking-wider">MATCH</span>
              </div>
            )}
            {!dancer.is_matched && dancer.liked_me && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-accent-hot)]">
                <Heart className="w-3 h-3 text-white fill-current" />
                <span className="text-[9px] font-bold text-white tracking-wider">LUBI CIĘ</span>
              </div>
            )}
            {dancer.is_trainer && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-brand)]">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
            {dancer.is_verified && (
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Name overlay - TIGHT typography */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-display-lg text-white tracking-tight">
            {dancer.name}
            {dancer.age && (
              <span className="font-normal text-white/60 ml-1">{dancer.age}</span>
            )}
          </h1>

          <div className="flex items-center gap-3 mt-1">
            {dancer.city && (
              <span className="flex items-center gap-1 text-white/60 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {dancer.city}
              </span>
            )}
            {dancer.height && (
              <span className="flex items-center gap-1 text-white/60 text-sm">
                <Ruler className="w-3.5 h-3.5" />
                {dancer.height}cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-5 space-y-4">
        {/* Bio - Clean text with breathing room */}
        {dancer.bio && (
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed py-2">
            {dancer.bio}
          </p>
        )}

        {/* Dance styles - Compact list */}
        {dancer.dance_styles && dancer.dance_styles.length > 0 && (
          <div className="card-premium overflow-hidden">
            {dancer.dance_styles.map((style, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  idx !== dancer.dance_styles!.length - 1 && 'border-b border-black/[0.03]'
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-[var(--color-brand-lighter)] flex items-center justify-center">
                  <Music className="w-4 h-4 text-[var(--color-brand)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-headline-sm block truncate">{style.style_name}</span>
                  <span className="text-caption text-xs">{getSkillLevelLabel(style.skill_level)}</span>
                </div>
                {style.is_teaching && (
                  <div className="px-2 py-0.5 rounded-md bg-[var(--color-brand-lighter)]">
                    <span className="text-[8px] font-bold text-[var(--color-brand)] tracking-wider">UCZY</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING ACTIONS - Pill style */}
      <div className="fixed bottom-24 left-4 right-4 z-20">
        <div className="flex gap-2.5 max-w-md mx-auto">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold shadow-lg transition-all',
              dancer.i_liked
                ? 'bg-[var(--color-accent-hot)] text-white'
                : 'bg-white text-[var(--color-text-primary)]'
            )}
          >
            <Heart className={cn('w-5 h-5', dancer.i_liked && 'fill-current')} />
            <span className="text-sm">{dancer.i_liked ? 'Lubisz' : 'Polub'}</span>
          </button>

          <button
            disabled={!dancer.is_matched || getOrCreateConversation.isPending}
            onClick={handleMessage}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold shadow-lg transition-all',
              dancer.is_matched
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-white/60 text-[var(--color-text-tertiary)]'
            )}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">
              {getOrCreateConversation.isPending ? 'Otwieranie...' : dancer.is_matched ? 'Napisz' : 'Dopasuj'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
