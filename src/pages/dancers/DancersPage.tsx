import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, PageHeader } from '@/components/ui'
import { FeaturedDancerCard, DancerRow } from '@/components/dancers'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON_CONTAINER, ICON, LAYOUT } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'

export function DancersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page] = useState(1)

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
      <PageHeader title="Tancerze" subtitle="Odkryj w Twojej okolicy">
        {/* Search */}
        <div className="relative">
          <Search className={cn('absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]', ICON.sm)} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj..."
            className={cn('input-premium w-full pl-11 pr-12 py-3 text-sm', ROUNDED.input)}
          />
          <button
            aria-label="Filtry wyszukiwania"
            className={cn('absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-brand)] flex items-center justify-center', ICON_CONTAINER.sm)}
          >
            <SlidersHorizontal className={cn(ICON.xs, 'text-white')} />
          </button>
        </div>
      </PageHeader>

      {/* Featured - Horizontal scroll */}
      {dancers.length > 0 && (
        <section className={LAYOUT.section}>
          <div className={cn('flex items-center justify-between', LAYOUT.sectionHeadingMargin)}>
            <h2 className="text-headline-sm">Wyroznienie</h2>
            <span className="text-caption text-xs">{data?.count || 0}</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
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

      {/* List */}
      <section className={LAYOUT.sectionLast}>
        <h2 className={cn('text-headline-sm', LAYOUT.sectionHeadingMargin)}>W poblizu</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <p className="text-body-sm text-red-500">Blad</p>
          </div>
        ) : dancers.length === 0 ? (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <Search className={cn(ICON.xl, 'text-[var(--color-text-tertiary)] mx-auto mb-3')} />
            <h3 className="text-headline-sm mb-1">Brak</h3>
            <p className="text-caption">{search ? 'Nie znaleziono' : 'Brak w poblizu'}</p>
          </div>
        ) : (
          <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
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
