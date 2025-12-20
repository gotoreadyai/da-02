import { useParams, useNavigate } from 'react-router-dom'
import { FloatingActionBar } from '@/components/ui/FloatingActionBar'
import { DetailRow } from '@/components/events'
import { ArrowLeft, MapPin, Users, Music, Calendar, Globe, Wallet, GraduationCap, Star, UserPlus, BookOpen, PartyPopper, Trophy, Mic } from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useRegisterForEvent } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel, getSkillLevelLabel, cn } from '@/lib/utils'
import { getGradientForName, ROUNDED, BADGE, ICON_CONTAINER, ICON, GAP, LIST_ITEM, LAYOUT } from '@/lib/constants'
import { Button, IconButton, Spinner } from '@/components/ui'

const typeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className={ICON.md} />,
  workshop: <GraduationCap className={ICON.md} />,
  social: <PartyPopper className={ICON.md} />,
  competition: <Trophy className={ICON.md} />,
  performance: <Mic className={ICON.md} />,
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: event, isLoading, isError } = useEvent(id!)
  const registerMutation = useRegisterForEvent()

  const handleRegister = () => {
    if (!event) return
    registerMutation.mutate(event.id, {
      onSuccess: () => toast.success('Zapisano!'),
      onError: () => toast.error('Nie udalo sie zapisac'),
    })
  }

  if (isLoading) {
    return (
      <div className={LAYOUT.loadingState}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="px-5 pt-13">
        <IconButton onClick={() => navigate(-1)} aria-label="Wroc" className="mb-5">
          <ArrowLeft className={ICON.md} />
        </IconButton>
        <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
          <span className="text-4xl mb-3 block">😕</span>
          <h2 className="text-headline-md mb-1">Nie znaleziono</h2>
          <p className="text-caption mb-4">To wydarzenie nie istnieje</p>
          <Button onClick={() => navigate('/events')}>
            Wroc
          </Button>
        </div>
      </div>
    )
  }

  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const isFull = event.max_participants ? event.participant_count >= event.max_participants : false
  const gradient = getGradientForName(event.title)

  return (
    <div className={LAYOUT.pageWithLargeFAB}>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] max-h-[400px]">
        <div className={cn('absolute inset-0', `bg-gradient-to-br ${gradient}`)}>
          {/* Large icon watermark */}
          <div className="absolute inset-0 flex items-center justify-center text-white/10">
            <div className="scale-[3]">
              {typeIcons[event.event_type] || <Calendar className={ICON.md} />}
            </div>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-13 px-5 flex justify-between items-start">
          <IconButton onClick={() => navigate(-1)} aria-label="Wroc" className="bg-black/20 backdrop-blur-md">
            <ArrowLeft className={cn(ICON.md, 'text-white')} />
          </IconButton>

          <div className={GAP.sm + ' flex'}>
            {event.price === 0 && (
              <div className={cn(BADGE.standard, 'bg-[var(--color-accent-mint)] flex items-center gap-1')}>
                <Star className={cn(ICON.xs, 'text-white')} />
                <span className="text-white">FREE</span>
              </div>
            )}
            {isPast && (
              <div className={cn(BADGE.standard, 'bg-black/40 backdrop-blur')}>
                <span className="text-white/80">ZAKONCZONE</span>
              </div>
            )}
          </div>
        </div>

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className={cn('flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm w-fit mb-2', ROUNDED.badge)}>
            {typeIcons[event.event_type]}
            <span className="text-[10px] font-semibold text-white">
              {getEventTypeLabel(event.event_type)}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className={cn(LAYOUT.section, 'pt-5 bg-gradient-to-b from-black/60 via-transparent via-40% to-transparent')}>
        {/* Description */}
        {event.description && (
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap mt-5 mb-5">
            {event.description}
          </p>
        )}

        {/* When & Where */}
        <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
          {/* Date & Time */}
          <div className={cn('flex items-center', LIST_ITEM.padding, LIST_ITEM.border)}>
            <div className={cn(ICON_CONTAINER.md, 'bg-[var(--color-brand)]/20 flex items-center justify-center')}>
              <Calendar className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">{formatDate(event.start_at)}</span>
              <span className="text-caption text-xs">{formatTime(event.start_at)} – {formatTime(event.end_at)}</span>
            </div>
          </div>

          {/* Location */}
          <div className={cn('flex items-center', LIST_ITEM.padding)}>
            <div className={cn(ICON_CONTAINER.md, 'bg-[var(--color-brand)]/20 flex items-center justify-center')}>
              {event.location_type === 'online' ? (
                <Globe className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
              ) : (
                <MapPin className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {event.location_type === 'online' ? (
                <>
                  <span className="text-headline-sm block">{event.online_platform || 'Online'}</span>
                  {event.online_link && (
                    <a href={event.online_link} target="_blank" rel="noopener noreferrer" className="text-caption text-[var(--color-brand)]">
                      Dołącz do spotkania
                    </a>
                  )}
                </>
              ) : (
                <>
                  <span className="text-headline-sm block truncate">{event.location_name || event.city}</span>
                  {event.address && (
                    <span className="text-caption text-xs truncate block">{event.address}</span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={cn('card-premium overflow-hidden mt-5', ROUNDED.card)}>
          {event.dance_style && (
            <DetailRow icon={<Music className={ICON.sm} />} label="Styl" value={event.dance_style.name} />
          )}
          {(event.skill_level_min || event.skill_level_max) && (
            <DetailRow
              icon={<GraduationCap className={ICON.sm} />}
              label="Poziom"
              value={`${event.skill_level_min ? getSkillLevelLabel(event.skill_level_min) : ''}${event.skill_level_max && event.skill_level_min !== event.skill_level_max ? ` – ${getSkillLevelLabel(event.skill_level_max)}` : ''}`}
            />
          )}
          <DetailRow
            icon={<Users className={ICON.sm} />}
            label="Miejsca"
            value={isFull ? 'Brak miejsc' : `${event.participant_count}${event.max_participants ? ` / ${event.max_participants}` : ''}`}
            accent={isFull}
          />
          <DetailRow
            icon={<Wallet className={ICON.sm} />}
            label="Cena"
            value={event.price > 0 ? `${event.price} ${event.currency}` : 'Bezpłatne'}
            isLast={!event.requires_partner}
          />
          {event.requires_partner && (
            <DetailRow
              icon={<UserPlus className={ICON.sm} />}
              label="Partner"
              value="Wymagany"
              accent
              isLast
            />
          )}
        </div>
      </div>

      {/* Floating action */}
      {!isPast && (
        <FloatingActionBar>
          <Button
            disabled={isFull || registerMutation.isPending}
            onClick={handleRegister}
            aria-label={isFull ? 'Brak wolnych miejsc' : 'Zapisz sie na wydarzenie'}
            variant={isFull ? 'secondary' : 'primary'}
            className="max-w-md"
          >
            {registerMutation.isPending ? (
              <Spinner size="sm" className="border-white border-t-transparent" />
            ) : isFull ? (
              'Brak miejsc'
            ) : (
              <>
                <Calendar className={ICON.md} />
                <span>Zapisz sie</span>
                {event.price > 0 && (
                  <span className={cn('ml-1 px-2 py-0.5 bg-white/20 text-xs', ROUNDED.circle)}>
                    {event.price} {event.currency}
                  </span>
                )}
              </>
            )}
          </Button>
        </FloatingActionBar>
      )}
    </div>
  )
}
