import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { MapPin, Heart, Sparkles, Award, GraduationCap, Search, SlidersHorizontal, Crown } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useMyProfile } from '@/features/profile/api'
import { cn, getInitials } from '@/lib/utils'
import type { PublicDancer } from '@/types/database'

export function DancersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page] = useState(1)

  const { data: profile } = useMyProfile()
  const { data, isLoading, isError } = useDancers({
    page,
    pageSize: 12,
    search: search || undefined,
  })

  const likeMutation = useLikeDancer()
  const unlikeMutation = useUnlikeDancer()

  const handleLike = (e: React.MouseEvent, dancer: PublicDancer) => {
    e.stopPropagation()
    if (dancer.i_liked) {
      unlikeMutation.mutate(dancer.id)
    } else {
      likeMutation.mutate(dancer.id)
    }
  }

  const dancers = data?.data || []

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-caption">Witaj ponownie</span>
            <h1 className="text-headline-lg">{profile?.name || 'Tancerzu'}</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[var(--color-brand-light)] shadow-md"
          >
            {profile?.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getInitials(profile?.name || 'U')}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj tancerzy..."
            className="input-premium pl-12 pr-12"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[var(--color-brand)] flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* Featured Section */}
      {dancers.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-6">
            <h2 className="text-headline-md">Wyróżnieni</h2>
            <button className="text-xs font-medium text-[var(--color-brand)]">Więcej</button>
          </div>

          {/* Horizontal scroll cards - tight gap */}
          <div className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide">
            {dancers.slice(0, 5).map((dancer) => (
              <FeaturedCard
                key={dancer.id}
                dancer={dancer}
                onPress={() => navigate(`/dancers/${dancer.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Dancers Section */}
      <section className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-headline-md">W pobliżu</h2>
          <span className="text-caption">{data?.count || 0} osób</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="card-premium p-8 text-center">
            <p className="text-body-sm text-red-500">Wystąpił błąd</p>
          </div>
        ) : dancers.length === 0 ? (
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[var(--color-text-tertiary)]" />
            </div>
            <h3 className="text-headline-sm mb-1">Brak tancerzy</h3>
            <p className="text-caption">
              {search ? 'Nie znaleziono tancerzy' : 'Brak tancerzy w pobliżu'}
            </p>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            {dancers.slice(4).map((dancer, index) => (
              <DancerRow
                key={dancer.id}
                dancer={dancer}
                onPress={() => navigate(`/dancers/${dancer.id}`)}
                onLike={(e) => handleLike(e, dancer)}
                isLast={index === dancers.slice(4).length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Featured Card - like mockup cards with badges
interface FeaturedCardProps {
  dancer: PublicDancer
  onPress: () => void
}

// Gradient paleta - ciepłe, dynamiczne kolory jak w mockupie
const cardGradients = [
  'from-[#F4A261] via-[#E9C46A] to-[#F4D35E]', // Warm peach/gold
  'from-[#E8B4B8] via-[#EEC4C8] to-[#F5D6D8]', // Pudrowy róż
  'from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE]', // Soft violet
  'from-[#F9A8D4] via-[#FBCFE8] to-[#FCE7F3]', // Pink blush
  'from-[#6EE7B7] via-[#A7F3D0] to-[#D1FAE5]', // Mint fresh
  'from-[#FCA5A5] via-[#FECACA] to-[#FEE2E2]', // Coral soft
]

function FeaturedCard({ dancer, onPress }: FeaturedCardProps) {
  // Deterministyczny gradient bazowany na pierwszej literze imienia
  const gradientIndex = (dancer.name?.charCodeAt(0) || 0) % cardGradients.length
  const gradient = cardGradients[gradientIndex]

  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-44 text-left active:scale-[0.98] transition-transform"
    >
      {/* Card z gradientem lub zdjęciem */}
      <div className={cn(
        'relative aspect-[3/4] rounded-3xl overflow-hidden shadow-lg',
        !dancer.profile_photo_url && `bg-gradient-to-br ${gradient}`
      )}>
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Avatar placeholder - duża litera centered */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[5rem] font-extralight text-white/40 select-none">
              {dancer.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Gradient overlay na dole dla tekstu */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Badge - mały, w rogu */}
        {dancer.is_matched ? (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--color-accent-mint)] flex items-center justify-center shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        ) : dancer.liked_me ? (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--color-accent-coral)] flex items-center justify-center shadow-lg">
            <Heart className="w-3.5 h-3.5 text-white fill-current" />
          </div>
        ) : dancer.is_trainer ? (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[var(--color-brand)] flex items-center justify-center shadow-lg">
            <Crown className="w-3.5 h-3.5 text-white" />
          </div>
        ) : null}

        {/* Content na dole karty - tight spacing */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-white font-semibold text-lg leading-tight truncate">
            {dancer.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3 h-3 text-white/60" />
            <span className="text-xs text-white/70">
              {dancer.city || 'Polska'}
              {dancer.age && ` · ${dancer.age}`}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// Dancer Row - list style like profile menu
interface DancerRowProps {
  dancer: PublicDancer
  onPress: () => void
  onLike: (e: React.MouseEvent) => void
  isLast: boolean
}

function DancerRow({ dancer, onPress, onLike, isLast }: DancerRowProps) {
  return (
    <button
      onClick={onPress}
      className={cn(
        'w-full flex items-center gap-4 p-4 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left',
        !isLast && 'border-b border-black/[0.04]'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[var(--color-bg)]">
          {dancer.profile_photo_url ? (
            <img
              src={dancer.profile_photo_url}
              alt={dancer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
              <span className="text-xl font-light text-white/90">
                {dancer.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Status indicator */}
        {dancer.is_matched && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent-mint)] border-2 border-white flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        {!dancer.is_matched && dancer.liked_me && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent-coral)] border-2 border-white flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 text-white fill-current" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-headline-sm truncate">{dancer.name}</span>
          {dancer.is_verified && (
            <Award className="w-4 h-4 text-blue-500 flex-shrink-0" />
          )}
          {dancer.is_trainer && (
            <GraduationCap className="w-4 h-4 text-[var(--color-brand)] flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2">
          {dancer.dance_styles?.[0] && (
            <span className="text-body-sm text-[var(--color-brand)]">
              {dancer.dance_styles[0].style_name}
            </span>
          )}
          {dancer.age && <span className="text-caption">• {dancer.age} lat</span>}
          {dancer.city && (
            <>
              <span className="text-caption">•</span>
              <span className="text-caption flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {dancer.city}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Like button */}
      <button
        onClick={onLike}
        className={cn(
          'w-11 h-11 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0',
          dancer.i_liked
            ? 'bg-[var(--color-accent-coral)]/10 text-[var(--color-accent-coral)]'
            : 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-coral)]'
        )}
      >
        <Heart className={cn('w-5 h-5', dancer.i_liked && 'fill-current')} />
      </button>
    </button>
  )
}
