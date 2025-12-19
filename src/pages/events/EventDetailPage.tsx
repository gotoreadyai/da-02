import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { DetailRow } from '@/components/events'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Music,
  Calendar,
  Globe,
  Wallet,
  GraduationCap,
  Star,
  UserPlus,
  BookOpen,
  PartyPopper,
  Trophy,
  Mic,
} from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useRegisterForEvent } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel, getSkillLevelLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { getGradientForName } from '@/lib/constants'

const typeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="w-5 h-5" />,
  workshop: <GraduationCap className="w-5 h-5" />,
  social: <PartyPopper className="w-5 h-5" />,
  competition: <Trophy className="w-5 h-5" />,
  performance: <Mic className="w-5 h-5" />,
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
      onError: () => toast.error('Nie udało się zapisać'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen px-4 pt-12">
        <button
          onClick={() => navigate(-1)}
          aria-label="Wróć"
          className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="card-premium p-6 text-center">
          <span className="text-4xl mb-3 block">😕</span>
          <h2 className="text-headline-md mb-1">Nie znaleziono</h2>
          <p className="text-caption mb-4">To wydarzenie nie istnieje</p>
          <button
            onClick={() => navigate('/events')}
            className="px-5 py-2.5 rounded-xl bg-[var(--color-brand)] text-white text-ui"
          >
            Wróć
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
    <div className="min-h-screen bg-[var(--color-bg)] pb-36">
      {/* HERO - Compact but impactful */}
      <div className="relative h-[50vh] min-h-[320px] max-h-[400px]">
        <div className={cn('absolute inset-0', `bg-gradient-to-br ${gradient}`)}>
          {/* Large icon watermark */}
          <div className="absolute inset-0 flex items-center justify-center text-white/10">
            <div className="scale-[3]">
              {typeIcons[event.event_type] || <Calendar className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 pt-12 px-4 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            aria-label="Wróć"
            className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-1.5">
            {event.price === 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-accent-mint)]">
                <Star className="w-3 h-3 text-white" />
                <span className="text-[9px] font-bold text-white">FREE</span>
              </div>
            )}
            {isPast && (
              <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur">
                <span className="text-[9px] font-bold text-white/80">ZAKOŃCZONE</span>
              </div>
            )}
          </div>
        </div>

        {/* Floating date card */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-5 py-3 shadow-xl text-center">
          <span className="text-3xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-[10px] font-bold text-[var(--color-brand)] uppercase">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Event info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm">
              {typeIcons[event.event_type]}
              <span className="text-[10px] font-semibold text-white">
                {getEventTypeLabel(event.event_type)}
              </span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight tracking-tight">
            {event.title}
          </h1>

          <div className="flex items-center gap-3 mt-1.5 text-white/60 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(event.start_at)}
            </span>
            {event.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {event.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 pt-5 space-y-4">
        {/* Quick info row */}
        <div className="card-premium p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-lighter)] flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[var(--color-brand)]" />
          </div>
          <div className="flex-1">
            <span className="text-headline-sm block">{formatDate(event.start_at)}</span>
            <span className="text-caption text-xs">{formatTime(event.start_at)} – {formatTime(event.end_at)}</span>
          </div>
          {isFull && (
            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-[9px] font-bold">PEŁNE</span>
          )}
        </div>

        {/* Description - Clean text with breathing room */}
        {event.description && (
          <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap py-2">
            {event.description}
          </p>
        )}

        {/* Location */}
        <div className="card-premium p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-lighter)] flex items-center justify-center">
            {event.location_type === 'online' ? (
              <Globe className="w-4 h-4 text-[var(--color-brand)]" />
            ) : (
              <MapPin className="w-4 h-4 text-[var(--color-brand)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {event.location_type === 'online' ? (
              <>
                <span className="text-headline-sm block">{event.online_platform || 'Online'}</span>
                {event.online_link && (
                  <a href={event.online_link} target="_blank" rel="noopener noreferrer" className="text-body-sm text-[var(--color-brand)]">
                    Dołącz
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
        <div className="card-premium overflow-hidden">
          {event.dance_style && (
            <DetailRow icon={<Music className="w-4 h-4" />} label="Styl" value={event.dance_style.name} />
          )}
          {(event.skill_level_min || event.skill_level_max) && (
            <DetailRow
              icon={<GraduationCap className="w-4 h-4" />}
              label="Poziom"
              value={`${event.skill_level_min ? getSkillLevelLabel(event.skill_level_min) : ''}${event.skill_level_max && event.skill_level_min !== event.skill_level_max ? ` – ${getSkillLevelLabel(event.skill_level_max)}` : ''}`}
            />
          )}
          <DetailRow
            icon={<Users className="w-4 h-4" />}
            label="Miejsca"
            value={`${event.participant_count}${event.max_participants ? ` / ${event.max_participants}` : ''}`}
          />
          <DetailRow
            icon={<Wallet className="w-4 h-4" />}
            label="Cena"
            value={event.price > 0 ? `${event.price} ${event.currency}` : 'Bezpłatne'}
            isLast={!event.requires_partner}
          />
          {event.requires_partner && (
            <DetailRow
              icon={<UserPlus className="w-4 h-4" />}
              label="Partner"
              value="Wymagany"
              accent
              isLast
            />
          )}
        </div>
      </div>

      {/* FLOATING ACTION */}
      {!isPast && (
        <div className="fixed bottom-24 left-4 right-4 z-20">
          <button
            disabled={isFull || registerMutation.isPending}
            onClick={handleRegister}
            aria-label={isFull ? 'Brak wolnych miejsc' : 'Zapisz się na wydarzenie'}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold shadow-lg transition-all max-w-md mx-auto',
              isFull
                ? 'bg-white/60 text-[var(--color-text-tertiary)]'
                : 'bg-[var(--color-brand)] text-white'
            )}
          >
            {registerMutation.isPending ? (
              <Spinner size="sm" className="border-white border-t-transparent" />
            ) : isFull ? (
              'Brak miejsc'
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Zapisz się</span>
                {event.price > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
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
