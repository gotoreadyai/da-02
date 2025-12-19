import { useParams, useNavigate } from 'react-router-dom'
import {
  Navbar,
  NavbarBackLink,
  Block,
  BlockTitle,
  Chip,
  Button,
  Preloader,
} from 'konsta/react'
import {
  MapPin,
  Clock,
  Users,
  Music,
  Calendar,
  Globe,
  DollarSign,
  BookOpen,
  GraduationCap,
  PartyPopper,
  Trophy,
  Mic,
} from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useRegisterForEvent } from '@/features/events/api'
import { formatDate, formatTime, getEventTypeLabel, getSkillLevelLabel } from '@/lib/utils'

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
        <Preloader />
      </div>
    )
  }

  if (isError || !event) {
    return (
      <div>
        <Navbar
          left={<NavbarBackLink onClick={() => navigate(-1)} />}
          title="Błąd"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">😕</span>
          <p className="text-gray-500">Nie znaleziono wydarzenia</p>
          <Button onClick={() => navigate('/events')} className="mt-4">
            Wróć do listy
          </Button>
        </div>
      </div>
    )
  }

  const startDate = new Date(event.start_at)
  const isPast = startDate < new Date()
  const isFull = event.max_participants
    ? event.participant_count >= event.max_participants
    : false

  return (
    <div className="pb-32">
      {/* Header */}
      <Navbar
        left={<NavbarBackLink onClick={() => navigate(-1)} />}
        title="Szczegóły"
      />

      {/* Event type banner */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          {eventTypeIcons[event.event_type]}
          <Chip className="!bg-white/20 !text-white">
            {getEventTypeLabel(event.event_type)}
          </Chip>
          {isPast && (
            <Chip className="!bg-gray-500 !text-white">Zakończone</Chip>
          )}
        </div>
        <h1 className="text-2xl font-bold">{event.title}</h1>
      </div>

      {/* Date & Time */}
      <Block>
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="w-14 h-14 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex flex-col items-center justify-center">
            <span className="text-xs text-brand-600 font-medium">
              {startDate.toLocaleDateString('pl-PL', { month: 'short' }).toUpperCase()}
            </span>
            <span className="text-xl font-bold text-brand-600">
              {startDate.getDate()}
            </span>
          </div>
          <div>
            <p className="font-medium">{formatDate(event.start_at)}</p>
            <p className="text-gray-500">
              {formatTime(event.start_at)} - {formatTime(event.end_at)}
            </p>
          </div>
        </div>
      </Block>

      {/* Location */}
      <BlockTitle>Lokalizacja</BlockTitle>
      <Block>
        <div className="flex items-start gap-3">
          {event.location_type === 'online' ? (
            <Globe className="w-5 h-5 text-brand-500 mt-0.5" />
          ) : (
            <MapPin className="w-5 h-5 text-brand-500 mt-0.5" />
          )}
          <div>
            {event.location_type === 'online' ? (
              <>
                <p className="font-medium">{event.online_platform || 'Online'}</p>
                {event.online_link && (
                  <a
                    href={event.online_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-500 text-sm"
                  >
                    Dołącz do spotkania
                  </a>
                )}
              </>
            ) : (
              <>
                <p className="font-medium">{event.location_name}</p>
                {event.address && (
                  <p className="text-gray-500 text-sm">{event.address}</p>
                )}
                {event.city && (
                  <p className="text-gray-500 text-sm">{event.city}</p>
                )}
              </>
            )}
          </div>
        </div>
      </Block>

      {/* Description */}
      {event.description && (
        <>
          <BlockTitle>Opis</BlockTitle>
          <Block>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {event.description}
            </p>
          </Block>
        </>
      )}

      {/* Details */}
      <BlockTitle>Szczegóły</BlockTitle>
      <Block>
        <div className="space-y-4">
          {/* Dance style */}
          {event.dance_style && (
            <div className="flex items-center gap-3">
              <Music className="w-5 h-5 text-gray-400" />
              <span>Styl: {event.dance_style.name}</span>
            </div>
          )}

          {/* Skill level */}
          {(event.skill_level_min || event.skill_level_max) && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <span>
                Poziom: {event.skill_level_min && getSkillLevelLabel(event.skill_level_min)}
                {event.skill_level_min && event.skill_level_max && event.skill_level_min !== event.skill_level_max && ' - '}
                {event.skill_level_max && event.skill_level_min !== event.skill_level_max && getSkillLevelLabel(event.skill_level_max)}
              </span>
            </div>
          )}

          {/* Participants */}
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <span>
              {event.participant_count} uczestników
              {event.max_participants && ` / ${event.max_participants} miejsc`}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <span>
              {event.price > 0
                ? `${event.price} ${event.currency}`
                : 'Bezpłatne'}
            </span>
          </div>

          {/* Partner required */}
          {event.requires_partner && (
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span>Wymagany partner</span>
            </div>
          )}
        </div>
      </Block>

      {/* Fixed bottom action */}
      {!isPast && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-lg mx-auto">
            <Button
              large
              className="w-full !bg-brand-500 active:!bg-brand-600"
              disabled={isFull || registerMutation.isPending}
              onClick={handleRegister}
            >
              {registerMutation.isPending
                ? 'Zapisywanie...'
                : isFull
                ? 'Brak miejsc'
                : `Zapisz się${event.price > 0 ? ` • ${event.price} ${event.currency}` : ''}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
