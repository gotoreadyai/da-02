import { useParams, useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Music,
  Calendar,
  Globe,
  Wallet,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Trophy,
  Mic,
  Star,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useRegisterForEvent } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel, getSkillLevelLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

const eventTypeIcons: Record<string, React.ReactNode> = {
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
      onSuccess: () => {
        toast.success('Zapisano na wydarzenie!')
      },
      onError: () => {
        toast.error('Nie udało się zapisać')
      },
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
      <div className="min-h-screen">
        <header className="px-6 pt-14 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mb-6"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <div className="card-premium p-8 text-center">
            <span className="text-6xl mb-4 block">😕</span>
            <h2 className="text-headline-md mb-2">Nie znaleziono wydarzenia</h2>
            <button
              onClick={() => navigate('/events')}
              className="mt-4 px-6 py-3 rounded-2xl bg-[var(--color-brand)] text-white text-body-sm font-medium"
            >
              Wróć do listy
            </button>
          </div>
        </header>
      </div>
    )
  }

  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const isFull = event.max_participants
    ? event.participant_count >= event.max_participants
    : false

  return (
    <div className="min-h-screen pb-32">
      {/* Hero section */}
      <div className="relative h-72">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
            <span className="text-7xl">💃</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Badges */}
        <div className="absolute top-14 right-6 flex gap-2">
          {event.price === 0 && (
            <span className="badge badge-success shadow-lg">
              <Star className="w-3 h-3" />
              BEZPŁATNE
            </span>
          )}
          {isPast && (
            <span className="badge bg-[var(--color-text-tertiary)] text-white shadow-lg">
              ZAKOŃCZONE
            </span>
          )}
        </div>

        {/* Info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-brand">
              {eventTypeIcons[event.event_type]}
              {getEventTypeLabel(event.event_type)}
            </span>
          </div>

          <h1 className="text-display-md text-white">{event.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 relative z-10">
        {/* Date & Time card */}
        <section className="mb-6">
          <div className="card-premium p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-light)] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-headline-md text-[var(--color-brand-dark)] leading-none">
                  {startDate.getDate()}
                </span>
                <span className="text-[10px] font-semibold text-[var(--color-brand)] uppercase">
                  {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
                </span>
              </div>
              <div>
                <span className="text-headline-sm block">{formatDate(event.start_at)}</span>
                <span className="text-caption flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(event.start_at)} - {formatTime(event.end_at)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mb-6">
          <h2 className="text-headline-md mb-4">Lokalizacja</h2>
          <div className="card-premium p-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center flex-shrink-0">
                {event.location_type === 'online' ? (
                  <Globe className="w-5 h-5 text-[var(--color-brand-dark)]" />
                ) : (
                  <MapPin className="w-5 h-5 text-[var(--color-brand-dark)]" />
                )}
              </div>
              <div>
                {event.location_type === 'online' ? (
                  <>
                    <span className="text-headline-sm block">{event.online_platform || 'Online'}</span>
                    {event.online_link && (
                      <a
                        href={event.online_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body-sm text-[var(--color-brand)]"
                      >
                        Dołącz do spotkania
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-headline-sm block">{event.location_name}</span>
                    {event.address && (
                      <span className="text-caption block">{event.address}</span>
                    )}
                    {event.city && (
                      <span className="text-caption">{event.city}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        {event.description && (
          <section className="mb-6">
            <h2 className="text-headline-md mb-4">Opis</h2>
            <div className="card-premium p-5">
              <p className="text-body-md text-[var(--color-text-secondary)] whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </section>
        )}

        {/* Details */}
        <section className="mb-6">
          <h2 className="text-headline-md mb-4">Szczegóły</h2>
          <div className="card-premium overflow-hidden">
            {/* Dance style */}
            {event.dance_style && (
              <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-[var(--color-brand-dark)]" />
                </div>
                <div className="flex-1">
                  <span className="text-caption block">Styl tańca</span>
                  <span className="text-headline-sm">{event.dance_style.name}</span>
                </div>
              </div>
            )}

            {/* Skill level */}
            {(event.skill_level_min || event.skill_level_max) && (
              <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[var(--color-brand-dark)]" />
                </div>
                <div className="flex-1">
                  <span className="text-caption block">Poziom</span>
                  <span className="text-headline-sm">
                    {event.skill_level_min && getSkillLevelLabel(event.skill_level_min)}
                    {event.skill_level_min && event.skill_level_max && event.skill_level_min !== event.skill_level_max && ' - '}
                    {event.skill_level_max && event.skill_level_min !== event.skill_level_max && getSkillLevelLabel(event.skill_level_max)}
                  </span>
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--color-brand-dark)]" />
              </div>
              <div className="flex-1">
                <span className="text-caption block">Uczestnicy</span>
                <span className="text-headline-sm">
                  {event.participant_count}
                  {event.max_participants && ` / ${event.max_participants}`}
                </span>
              </div>
              {isFull && (
                <span className="badge bg-red-100 text-red-600">PEŁNE</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
              <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-[var(--color-brand-dark)]" />
              </div>
              <div className="flex-1">
                <span className="text-caption block">Cena</span>
                <span className="text-headline-sm">
                  {event.price > 0 ? `${event.price} ${event.currency}` : 'Bezpłatne'}
                </span>
              </div>
            </div>

            {/* Partner required */}
            {event.requires_partner && (
              <div className="flex items-center gap-4 p-4">
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-accent-coral)]/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[var(--color-accent-coral)]" />
                </div>
                <div className="flex-1">
                  <span className="text-headline-sm">Wymagany partner</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Fixed bottom action */}
      {!isPast && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
          <div className="max-w-lg mx-auto">
            <button
              disabled={isFull || registerMutation.isPending}
              onClick={handleRegister}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-headline-sm transition-all',
                isFull
                  ? 'bg-[var(--color-bg)] text-[var(--color-text-tertiary)] border border-black/[0.04]'
                  : 'bg-[var(--color-brand)] text-white'
              )}
            >
              {registerMutation.isPending ? (
                'Zapisywanie...'
              ) : isFull ? (
                'Brak miejsc'
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Zapisz się{event.price > 0 && ` • ${event.price} ${event.currency}`}
                </>
              )}
            </button>
          </div>
          {/* Safe area spacer */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      )}
    </div>
  )
}
