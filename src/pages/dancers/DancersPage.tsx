import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner, PageHeader } from '@/components/ui'
import { FeaturedDancerCard, DancerRow } from '@/components/dancers'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useDancers, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON_CONTAINER, ICON, LAYOUT, getGradientForStatus } from '@/lib/constants'
import type { PublicDancer } from '@/types/database'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'

export function DancersPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)

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
    <div className="overflow-x-hidden">

      {/* Featured - Tinder Style Slider */}
      {dancers.length > 0 && (
        <section className="mb-6 pt-16 relative">
          {/* Ambient light - góra */}
          <div
            className={cn(
              'absolute inset-x-0 -top-10 h-48 blur-[100px] opacity-10 transition-all duration-1000 pointer-events-none',
              `bg-gradient-to-b ${dancers[activeIndex] ? getGradientForStatus(dancers[activeIndex]) : ''}`
            )}
          />

          {/* Ambient light - środek */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/4 w-[500px] h-[600px] rounded-full blur-[120px] opacity-15 transition-all duration-700 pointer-events-none',
              `bg-gradient-to-br ${dancers[activeIndex] ? getGradientForStatus(dancers[activeIndex]) : ''}`
            )}
          />

          {/* Ambient light - dół */}
          <div
            className={cn(
              'absolute inset-x-0 -bottom-20 h-48 blur-[100px] opacity-10 transition-all duration-1000 pointer-events-none',
              `bg-gradient-to-t ${dancers[activeIndex] ? getGradientForStatus(dancers[activeIndex]) : ''}`
            )}
          />

          {/* Subtle particles/dots */}
          <div className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 1px, transparent 1px),
                               radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 1px, transparent 1px),
                               radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: '100px 100px, 80px 80px, 120px 120px'
            }}
          />

          <div className="relative flex justify-center py-6">
            <Swiper
              effect="cards"
              grabCursor
              modules={[EffectCards]}
              className="w-[calc(100vw-40px)] max-w-[360px] h-[560px]"
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              cardsEffect={{
                perSlideOffset: 6,
                perSlideRotate: 0.5,
                rotate: true,
                slideShadows: true,
              }}
            >
              {dancers.slice(0, 8).map((dancer, idx) => (
                <SwiperSlide key={dancer.id} className="rounded-3xl">
                  <FeaturedDancerCard
                    dancer={dancer}
                    onPress={() => navigate(`/dancers/${dancer.id}`)}
                    isActive={idx === activeIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* List */}
      <section className={LAYOUT.sectionLast}>
        <h2 className={cn('text-headline-sm', LAYOUT.sectionHeadingMargin)}>W pobliżu</h2>

        {/* Search */}
        <div className="relative mb-4">
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
