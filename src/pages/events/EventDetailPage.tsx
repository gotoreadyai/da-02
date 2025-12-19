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

// Gradient paleta dla wydarzeń
const eventGradients = [
  'from-[#667EEA] via-[#764BA2] to-[#F093FB]', // Purple dream
  'from-[#FF6B6B] via-[#FF8E53] to-[#FEC89A]', // Sunset warm
  'from-[#4FACFE] via-[#00F2FE] to-[#43E97B]', // Ocean fresh
  'from-[#FA709A] via-[#FEE140] to-[#FFCF48]', // Pink gold
  'from-[#A18CD1] via-[#FBC2EB] to-[#FAD0C4]', // Lavender blush
  'from-[#F4A261] via-[#E9C46A] to-[#F4D35E]', // Warm peach
]

const eventTypeIcons: Record<string, React.ReactNode> = {
  lesson: <BookOpen className="w-4 h-4" />,
  workshop: <GraduationCap className="w-4 h-4" />,
  social: <PartyPopper className="w-4 h-4" />,
  competition: <Trophy className="w-4 h-4" />,
  performance: <Mic className="w-4 h-4" />,
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
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <header className="px-6 pt-14 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center mb-8"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <div className="card-premium p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-headline-lg mb-2">Nie znaleziono</h2>
            <p className="text-caption mb-6">To wydarzenie nie istnieje</p>
            <button
              onClick={() => navigate('/events')}
              className="px-8 py-3.5 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm"
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

  // Deterministyczny gradient
  const gradientIndex = event.title.charCodeAt(0) % eventGradients.length
  const gradient = eventGradients[gradientIndex]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-28">
      {/* Hero - gradient background */}
      <div className="relative aspect-[4/3]">
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          `bg-gradient-to-br ${gradient}`
        )}>
          {/* Event type icon - large, subtle */}
          <div className="text-white/20 transform scale-[4]">
            {eventTypeIcons[event.event_type] || <Calendar className="w-4 h-4" />}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 pt-14 px-6 flex justify-between items-start">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Status badges */}
          <div className="flex gap-2">
            {event.price === 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-mint)] shadow-lg">
                <Star className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] font-bold text-white tracking-wide">FREE</span>
              </div>
            )}
            {isPast && (
              <div className="flex items-center px-3 py-1.5 rounded-full bg-black/50 backdrop-blur shadow-lg">
                <span className="text-[11px] font-bold text-white/80 tracking-wide">ZAKOŃCZONE</span>
              </div>
            )}
          </div>
        </div>

        {/* Date badge - big, prominent */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-3xl px-6 py-4 shadow-2xl text-center">
          <span className="text-4xl font-bold text-[var(--color-text-primary)] leading-none block">
            {startDate.getDate()}
          </span>
          <span className="text-xs font-semibold text-[var(--color-brand)] uppercase mt-1 block">
            {startDate.toLocaleDateString('pl-PL', { month: 'short' })}
          </span>
        </div>

        {/* Event info - na dole hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
              {eventTypeIcons[event.event_type]}
              <span className="text-[11px] font-semibold text-white">
                {getEventTypeLabel(event.event_type)}
              </span>
            </div>
          </div>

          <h1 className="text-[2rem] font-bold text-white leading-tight tracking-tight">
            {event.title}
          </h1>

          <div className="flex items-center gap-3 mt-3 text-white/70 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatTime(event.start_at)}
            </span>
            {event.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {event.city}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 relative z-10 space-y-5">
        {/* Quick info card */}
        <div className="card-premium p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[var(--color-brand-dark)]" />
              </div>
              <div>
                <span className="text-headline-sm block">{formatDate(event.start_at)}</span>
                <span className="text-caption">{formatTime(event.start_at)} - {formatTime(event.end_at)}</span>
              </div>
            </div>
            {isFull && (
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-[11px] font-semibold">PEŁNE</span>
            )}
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="card-premium p-5">
            <p className="text-body-md text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        {/* Location */}
        <section>
          <h2 className="text-label text-[var(--color-text-tertiary)] mb-3 px-1">LOKALIZACJA</h2>
          <div className="card-premium p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                {event.location_type === 'online' ? (
                  <Globe className="w-5 h-5 text-[var(--color-brand-dark)]" />
                ) : (
                  <MapPin className="w-5 h-5 text-[var(--color-brand-dark)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
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
                    <span className="text-headline-sm block truncate">{event.location_name}</span>
                    <span className="text-caption block truncate">
                      {[event.address, event.city].filter(Boolean).join(', ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <section>
          <h2 className="text-label text-[var(--color-text-tertiary)] mb-3 px-1">SZCZEGÓŁY</h2>
          <div className="card-premium overflow-hidden">
            {/* Dance style */}
            {event.dance_style && (
              <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
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
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
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
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--color-brand-dark)]" />
              </div>
              <div className="flex-1">
                <span className="text-caption block">Uczestnicy</span>
                <span className="text-headline-sm">
                  {event.participant_count}
                  {event.max_participants && ` / ${event.max_participants}`}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
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
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-coral)]/10 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[var(--color-accent-coral)]" />
                </div>
                <div className="flex-1">
                  <span className="text-headline-sm">Wymagany partner</span>
                  <span className="text-caption block">Przyjdź z partnerem do tańca</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Fixed bottom action - floating */}
      {!isPast && (
        <div className="fixed bottom-6 left-6 right-6 z-20">
          <div className="max-w-lg mx-auto">
            <button
              disabled={isFull || registerMutation.isPending}
              onClick={handleRegister}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-headline-sm shadow-xl transition-all',
                isFull
                  ? 'bg-white/80 text-[var(--color-text-tertiary)] border border-black/[0.06]'
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
                  Zapisz się
                  {event.price > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-sm">
                      {event.price} {event.currency}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
