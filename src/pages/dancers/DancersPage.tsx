import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Preloader } from 'konsta/react'
import { MapPin, Heart, Sparkles, Award, GraduationCap, Search, SlidersHorizontal } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useMyProfile } from '@/features/profile/api'
import { cn, getInitials } from '@/lib/utils'
import type { PublicDancer } from '@/types/database'

export function DancersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Witaj</p>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.name || 'Tancerzu'} <span className="wave">👋</span>
            </h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-soft border border-white/20 flex items-center justify-center overflow-hidden"
          >
            {profile?.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold text-brand-600">
                {getInitials(profile?.name || 'U')}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj tancerzy..."
            className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl pl-12 pr-12 py-3.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Featured dancer banner */}
      {dancers.length > 0 && dancers[0] && (
        <div className="px-5 mb-6">
          <FeaturedDancerCard
            dancer={dancers[0]}
            onPress={() => navigate(`/dancers/${dancers[0].id}`)}
          />
        </div>
      )}

      {/* Section title */}
      <div className="px-5 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Odkryj tancerzy</h2>
        <button className="text-sm text-brand-600 font-medium">Zobacz wszystkich</button>
      </div>

      {/* Content */}
      <div className="px-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Preloader />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-500">Wystapil blad</p>
          </div>
        ) : dancers.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-gray-500">
              {search ? 'Nie znaleziono tancerzy' : 'Brak tancerzy'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dancers.slice(1).map((dancer, index) => (
              <DancerCard
                key={dancer.id}
                dancer={dancer}
                onPress={() => navigate(`/dancers/${dancer.id}`)}
                onLike={(e) => handleLike(e, dancer)}
                isLikeLoading={likeMutation.isPending || unlikeMutation.isPending}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Featured dancer card (large banner style)
function FeaturedDancerCard({ dancer, onPress }: { dancer: PublicDancer; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="w-full relative h-48 rounded-3xl overflow-hidden shadow-card card-interactive"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-accent-pink to-orange-400">
        {dancer.profile_photo_url && (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-90"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 30%)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-5 text-left">
        <span className="text-white/80 text-sm font-medium mb-1">Wyrozniiony tancerz</span>
        <h3 className="text-white text-2xl font-bold mb-2">{dancer.name}</h3>
        <div className="flex items-center gap-2">
          {dancer.dance_styles?.slice(0, 2).map((style, idx) => (
            <span
              key={idx}
              className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full"
            >
              {style.style_name}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

// Dancer card component
interface DancerCardProps {
  dancer: PublicDancer
  onPress: () => void
  onLike: (e: React.MouseEvent) => void
  isLikeLoading: boolean
  index: number
}

function DancerCard({ dancer, onPress, onLike, isLikeLoading, index }: DancerCardProps) {
  return (
    <button
      onClick={onPress}
      className="stagger-item w-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-card border border-white/20 card-interactive text-left"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex">
        {/* Photo */}
        <div className="relative w-32 h-40 flex-shrink-0 bg-gradient-to-br from-brand-100 to-pink-100">
          {dancer.profile_photo_url ? (
            <img
              src={dancer.profile_photo_url}
              alt={dancer.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">
                {dancer.name?.charAt(0)?.toUpperCase() || '👤'}
              </span>
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {dancer.is_matched && (
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-lg">
                <Sparkles className="w-3 h-3" />
                Match!
              </span>
            )}
            {!dancer.is_matched && dancer.liked_me && (
              <span className="gradient-brand text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium shadow-lg">
                <Heart className="w-3 h-3 fill-current" />
                Lubi Cie
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            {/* Name & badges */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg truncate">
                {dancer.name}
              </h3>
              {dancer.is_verified && (
                <Award className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
              {dancer.is_trainer && (
                <GraduationCap className="w-4 h-4 text-purple-500 flex-shrink-0" />
              )}
            </div>

            {/* Age & City */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              {dancer.age && <span>{dancer.age} lat</span>}
              {dancer.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {dancer.city}
                </span>
              )}
            </div>

            {/* Dance styles */}
            {dancer.dance_styles && dancer.dance_styles.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {dancer.dance_styles.slice(0, 3).map((style, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-brand-100/80 text-brand-700 px-2.5 py-1 rounded-full font-medium"
                  >
                    {style.style_name}
                  </span>
                ))}
                {dancer.dance_styles.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                    +{dancer.dance_styles.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Like button */}
        <div className="p-4 flex items-center">
          <button
            onClick={onLike}
            disabled={isLikeLoading}
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-soft',
              dancer.i_liked
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-400 hover:bg-brand-100 hover:text-brand-500'
            )}
          >
            <Heart
              className={cn(
                'w-5 h-5',
                dancer.i_liked && 'fill-current heart-animate'
              )}
            />
          </button>
        </div>
      </div>
    </button>
  )
}
