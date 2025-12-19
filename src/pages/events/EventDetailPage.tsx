import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { DetailRow } from '@/components/events'
import { ArrowLeft, MapPin, Clock, Users, Music, Calendar, Globe, Wallet, GraduationCap, Star, UserPlus, BookOpen, PartyPopper, Trophy, Mic } from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useRegisterForEvent } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel, getSkillLevelLabel, cn } from '@/lib/utils'
import { getGradientForName, LAYOUT, ROUNDED, BADGE, ICON_CONTAINER, ICON, GAP, LIST_ITEM } from '@/lib/constants'

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
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="px-5 pt-13">
        <button
          onClick={() => navigate(-1)}
          aria-label="Wroc"
          className={cn(ICON_CONTAINER.md, 'bg-[var(--color-bg-card)] shadow-sm flex items-center justify-center mb-5', ROUNDED.avatarRounded)}
        >
          <ArrowLeft className={ICON.md} />
        </button>
        <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
          <span className="text-4xl mb-3 block">😕</span>
          <h2 className="text-headline-md mb-1">Nie znaleziono</h2>
          <p className="text-caption mb-4">To wydarzenie nie istnieje</p>
          <button onClick={() => navigate('/events')} className={cn('px-5 py-3 bg-[var(--color-brand)] text-white text-ui', ROUNDED.button)}>
            Wroc
          </button>
        </div>
      </div>
    )
  }

  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const isFull = event.max_participants ? event.participant_count >= event.max_participants : false
  const gradient = getGradientForName(event.title)

  return (
    <div className="pb-36">
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
          <button
            onClick={() => navigate(-1)}
            aria-label="Wroc"
            className={cn(ICON_CONTAINER.md, 'bg-black/20 backdrop-blur-md flex items-center justify-center', ROUNDED.avatarRounded)}
          >
            <ArrowLeft className={cn(ICON.md, 'text-white')} />
          </button>

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

        {/* Floating date card */}
        <div className={cn('absolute top-20 left-1/2 -translate-x-1/2 bg-[var(--color-bg-card)] px-5 py-3 shadow-xl text-center', ROUNDED.card)}>
          <span className="text-3xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-[10px] font-bold text-[var(--color-brand)] uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className={cn('flex items-center mb-2', GAP.sm)}>
            <div className={cn('flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm', ROUNDED.badge)}>
              {typeIcons[event.event_type]}
              <span className="text-[10px] font-semibold text-white">
                {getEventTypeLabel(event.event_type)}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">
            {event.title}
          </h1>

          <div className={cn('flex items-center mt-2 text-white/60 text-sm', GAP.md)}>
            <span className={cn('flex items-center', GAP.xs)}>
              <Clock className={ICON.xs} />
              {formatTime(event.start_at)}
            </span>
            {event.city && (
              <span className={cn('flex items-center', GAP.xs)}>
                <MapPin className={ICON.xs} />
                {event.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={LAYOUT.section}>
        {/* Quick info row */}
        <div className={cn('card-premium flex items-center', LIST_ITEM.padding, ROUNDED.card)}>
          <div className={cn(ICON_CONTAINER.md, 'bg-[var(--color-brand)]/20 flex items-center justify-center')}>
            <Calendar className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
          </div>
          <div className="flex-1">
            <span className="text-headline-sm block">{formatDate(event.start_at)}</span>
            <span className="text-caption text-xs">{formatTime(event.start_at)} – {formatTime(event.end_at)}</span>
          </div>
          {isFull && (
            <span className={cn(BADGE.inline, 'bg-red-100 text-red-600')}>PELNE</span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap py-3">
            {event.description}
          </p>
        )}

        {/* Location */}
        <div className={cn('card-premium flex items-center mt-5', LIST_ITEM.padding, ROUNDED.card)}>
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
                  <a href={event.online_link} target="_blank" rel="noopener noreferrer" className="text-body-sm text-[var(--color-brand)]">
                    Dolacz
                  </a>
                )}
              </>
            ) : (
              <>
                <span className="text-headline-sm block truncate">{event.location_name}</span>
                <span className="text-caption text-xs truncate block">
                  {[event.address, event.city].filter(Boolean).join(', ')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Details grid */}
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
            value={`${event.participant_count}${event.max_participants ? ` / ${event.max_participants}` : ''}`}
          />
          <DetailRow
            icon={<Wallet className={ICON.sm} />}
            label="Cena"
            value={event.price > 0 ? `${event.price} ${event.currency}` : 'Bezplatne'}
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
        <div className={LAYOUT.floatingAction}>
          <button
            disabled={isFull || registerMutation.isPending}
            onClick={handleRegister}
            aria-label={isFull ? 'Brak wolnych miejsc' : 'Zapisz sie na wydarzenie'}
            className={cn(
              'w-full flex items-center justify-center py-4 font-semibold shadow-lg transition-all max-w-md mx-auto',
              GAP.sm,
              ROUNDED.button,
              isFull ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-tertiary)]' : 'bg-[var(--color-brand)] text-white'
            )}
          >
            {registerMutation.isPending ? (
              <Spinner size="sm" className="border-white border-t-transparent" />
            ) : isFull ? (
              'Brak miejsc'
            ) : (
              <>
                <Calendar className={ICON.md} />
                <span className="text-sm">Zapisz sie</span>
                {event.price > 0 && (
                  <span className={cn('ml-1 px-2 py-0.5 bg-white/20 text-xs', ROUNDED.circle)}>
                    {event.price} {event.currency}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
