import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { MapPin, Heart, Sparkles, Award, GraduationCap, Search, SlidersHorizontal, Crown } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useMyProfile } from '@/features/profile/api'
import { cn, getInitials } from '@/lib/utils'
import type { PublicDancer } from '@/types/database'

// 2026 Gradient palette - ELECTRIC
const gradients = [
  'from-[#8B5CF6] via-[#EC4899] to-[#F97316]',
  'from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]',
  'from-[#F97316] via-[#EF4444] to-[#EC4899]',
  'from-[#10B981] via-[#06B6D4] to-[#3B82F6]',
  'from-[#EC4899] via-[#8B5CF6] to-[#06B6D4]',
  'from-[#FBBF24] via-[#F97316] to-[#EF4444]',
]

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
    <div className="min-h-screen pb-6">
      {/* HEADER - Tight */}
      <header className="px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-caption text-xs">Witaj</span>
            <h1 className="text-headline-lg">{profile?.name || 'Tancerzu'}</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-[var(--color-brand-light)]"
          >
            {profile?.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-brand flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {getInitials(profile?.name || 'U')}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Search - Compact */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj..."
            className="input-premium pl-10 pr-10 py-2.5 text-sm"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </header>

      {/* FEATURED - Horizontal scroll */}
      {dancers.length > 0 && (
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2 px-4">
            <h2 className="text-headline-sm">Wyróżnieni</h2>
            <span className="text-caption text-xs">{data?.count || 0}</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 px-4 scrollbar-hide">
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

      {/* LIST - Compact rows */}
      <section className="px-4">
        <h2 className="text-headline-sm mb-2">W pobliżu</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="card-premium p-6 text-center">
            <p className="text-body-sm text-red-500">Błąd</p>
          </div>
        ) : dancers.length === 0 ? (
          <div className="card-premium p-6 text-center">
            <Search className="w-6 h-6 text-[var(--color-text-tertiary)] mx-auto mb-2" />
            <h3 className="text-headline-sm mb-0.5">Brak</h3>
            <p className="text-caption text-xs">{search ? 'Nie znaleziono' : 'Brak w pobliżu'}</p>
          </div>
        ) : (
          <div className="card-premium overflow-hidden">
            {dancers.slice(4).map((dancer, idx) => (
              <DancerRow
                key={dancer.id}
                dancer={dancer}
                onPress={() => navigate(`/dancers/${dancer.id}`)}
                onLike={(e) => handleLike(e, dancer)}
                isLast={idx === dancers.slice(4).length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// FEATURED CARD - Tight, impactful
function FeaturedCard({ dancer, onPress }: { dancer: PublicDancer; onPress: () => void }) {
  const gradientIndex = (dancer.name?.charCodeAt(0) || 0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-36 text-left active:scale-[0.97] transition-transform"
    >
      <div className={cn(
        'relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md',
        !dancer.profile_photo_url && `bg-gradient-to-br ${gradient}`
      )}>
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white/15 select-none">
              {dancer.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        {dancer.is_matched ? (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[var(--color-accent-mint)] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        ) : dancer.liked_me ? (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[var(--color-accent-hot)] flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        ) : dancer.is_trainer ? (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[var(--color-brand)] flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        ) : null}

        {/* Info */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">
            {dancer.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-white/50" />
            <span className="text-[10px] text-white/60 truncate">
              {dancer.city || 'Polska'}
              {dancer.age && `, ${dancer.age}`}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

// DANCER ROW - Compact list item
function DancerRow({
  dancer,
  onPress,
  onLike,
  isLast,
}: {
  dancer: PublicDancer
  onPress: () => void
  onLike: (e: React.MouseEvent) => void
  isLast: boolean
}) {
  const gradientIndex = (dancer.name?.charCodeAt(0) || 0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <div
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPress()}
      className={cn(
        'w-full flex items-center gap-3 p-3 hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors text-left cursor-pointer',
        !isLast && 'border-b border-black/[0.03]'
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-xl overflow-hidden">
          {dancer.profile_photo_url ? (
            <img src={dancer.profile_photo_url} alt={dancer.name} className="w-full h-full object-cover" />
          ) : (
            <div className={cn('w-full h-full flex items-center justify-center', `bg-gradient-to-br ${gradient}`)}>
              <span className="text-lg font-semibold text-white/80">
                {dancer.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>
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
