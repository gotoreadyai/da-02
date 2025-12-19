import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { FeaturedDancerCard, DancerRow } from '@/components/dancers'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { useMyProfile } from '@/features/profile/api'
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
            aria-label="Przejdź do profilu"
            className="ring-2 ring-[var(--color-brand-light)] rounded-xl"
          >
            <Avatar
              src={profile?.profile_photo_url}
              name={profile?.name || 'U'}
              size="sm"
              shape="rounded"
            />
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
          <button
            aria-label="Filtry wyszukiwania"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center"
          >
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
              <FeaturedDancerCard
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
