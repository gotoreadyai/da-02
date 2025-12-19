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
import { cn, formatDate, getSkillLevelLabel, getInitials } from '@/lib/utils'

// Gradient paleta dla profili bez zdjęcia
const profileGradients = [
  'from-[#667EEA] via-[#764BA2] to-[#F093FB]', // Purple dream
  'from-[#FF6B6B] via-[#FF8E53] to-[#FEC89A]', // Sunset warm
  'from-[#4FACFE] via-[#00F2FE] to-[#43E97B]', // Ocean fresh
  'from-[#FA709A] via-[#FEE140] to-[#FFCF48]', // Pink gold
  'from-[#A18CD1] via-[#FBC2EB] to-[#FAD0C4]', // Lavender blush
  'from-[#F4A261] via-[#E9C46A] to-[#F4D35E]', // Warm peach
]

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
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !dancer) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <header className="px-6 pt-14 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <div className="card-premium p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-headline-lg mb-2">Nie znaleziono</h2>
            <p className="text-caption mb-6">Ten profil nie istnieje lub został usunięty</p>
            <button
              onClick={() => navigate('/dancers')}
              className="px-8 py-3.5 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm"
            >
              Wróć do listy
            </button>
          </div>
        </header>
      </div>
    )
  }

  // Deterministyczny gradient
  const gradientIndex = (dancer.name?.charCodeAt(0) || 0) % profileGradients.length
  const gradient = profileGradients[gradientIndex]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* Hero - full bleed photo/gradient */}
      <div className="relative aspect-[3/4] max-h-[70vh]">
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            `bg-gradient-to-br ${gradient}`
          )}>
            <span className="text-[12rem] font-extralight text-white/30 select-none">
              {getInitials(dancer.name || '?')}
            </span>
          </div>
        )}

        {/* Gradient overlay - więcej na dole */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 pt-14 px-6 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Status badges - pionowo */}
          <div className="flex flex-col gap-2">
            {dancer.is_matched && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-mint)] shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold text-white tracking-wide">MATCH</span>
              </div>
            )}
            {!dancer.is_matched && dancer.liked_me && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-coral)] shadow-lg">
                <Heart className="w-3.5 h-3.5 text-white fill-current" />
                <span className="text-[11px] font-bold text-white tracking-wide">LUBI CIĘ</span>
              </div>
            )}
            {dancer.is_trainer && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-brand)] shadow-lg">
                <Crown className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold text-white tracking-wide">TRENER</span>
              </div>
            )}
            {dancer.is_verified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500 shadow-lg">
                <Award className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Name & basic info - na dole hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-[2.5rem] font-bold text-white leading-tight tracking-tight">
            {dancer.name}
            {dancer.age && (
              <span className="font-normal text-white/70 ml-2">{dancer.age}</span>
            )}
          </h1>

          <div className="flex items-center gap-4 mt-2">
            {dancer.city && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <MapPin className="w-4 h-4" />
                {dancer.city}
              </span>
            )}
            {dancer.height && (
              <span className="flex items-center gap-1.5 text-white/70 text-sm">
                <Ruler className="w-4 h-4" />
                {dancer.height} cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content - pull up over hero */}
      <div className="px-6 -mt-4 relative z-10 space-y-5">
        {/* Bio card */}
        {dancer.bio && (
          <div className="card-premium p-5">
            <p className="text-body-md text-[var(--color-text-secondary)] leading-relaxed">
              {dancer.bio}
            </p>
          </div>
        )}

        {/* Dance styles */}
        {dancer.dance_styles && dancer.dance_styles.length > 0 && (
          <section>
            <h2 className="text-label text-[var(--color-text-tertiary)] mb-3 px-1">STYLE TAŃCA</h2>
            <div className="card-premium overflow-hidden">
              {dancer.dance_styles.map((style, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-4 p-4',
                    index !== dancer.dance_styles!.length - 1 && 'border-b border-black/[0.04]'
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                    <Music className="w-5 h-5 text-[var(--color-brand-dark)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-headline-sm block truncate">{style.style_name}</span>
                    <span className="text-caption">{getSkillLevelLabel(style.skill_level)}</span>
                  </div>
                  {style.is_teaching && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--color-brand-light)]">
                      <GraduationCap className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                      <span className="text-[10px] font-semibold text-[var(--color-brand)]">UCZY</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Member since */}
        <div className="flex items-center gap-3 px-1 text-[var(--color-text-tertiary)]">
          <Calendar className="w-4 h-4" />
          <span className="text-caption">Dołączył {formatDate(dancer.created_at)}</span>
        </div>
      </div>

      {/* Fixed bottom actions - floating style */}
      <div className="fixed bottom-6 left-6 right-6 z-20">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className={cn(
              'flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-headline-sm shadow-xl transition-all',
              dancer.i_liked
                ? 'bg-[var(--color-accent-coral)] text-white'
                : 'bg-white text-[var(--color-text-primary)] border border-black/[0.06]'
            )}
          >
            <Heart className={cn('w-5 h-5', dancer.i_liked && 'fill-current')} />
            {dancer.i_liked ? 'Polubiono' : 'Polub'}
          </button>

          <button
            disabled={!dancer.is_matched}
            onClick={() => navigate('/chat')}
            className={cn(
              'flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-headline-sm shadow-xl transition-all',
              dancer.is_matched
                ? 'bg-[var(--color-brand)] text-white'
                : 'bg-white/80 text-[var(--color-text-tertiary)] border border-black/[0.06]'
            )}
          >
            <MessageCircle className="w-5 h-5" />
            {dancer.is_matched ? 'Napisz' : 'Dopasuj się'}
          </button>
        </div>
      </div>
    </div>
  )
}
