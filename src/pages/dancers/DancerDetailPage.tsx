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
  Ruler,
  Calendar,
  Music,
  Award,
  GraduationCap,
  Heart,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import { useDancer, useLikeDancer, useUnlikeDancer } from '@/features/dancers/api'
import { cn, formatDate, getSkillLevelLabel } from '@/lib/utils'

export function DancerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: dancer, isLoading, isError } = useDancer(id!)
  const likeMutation = useLikeDancer()
  const unlikeMutation = useUnlikeDancer()

  const handleLike = () => {
    if (!dancer) return
    if (dancer.i_liked) {
      unlikeMutation.mutate(dancer.id)
    } else {
      likeMutation.mutate(dancer.id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Preloader />
      </div>
    )
  }

  if (isError || !dancer) {
    return (
      <div>
        <Navbar
          left={<NavbarBackLink onClick={() => navigate(-1)} />}
          title="Błąd"
        />
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">😕</span>
          <p className="text-gray-500">Nie znaleziono profilu</p>
          <Button onClick={() => navigate('/dancers')} className="mt-4">
            Wróć do listy
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Header with photo */}
      <div className="relative h-96 bg-gradient-to-br from-brand-100 to-purple-100">
        {dancer.profile_photo_url ? (
          <img
            src={dancer.profile_photo_url}
            alt={dancer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl">
              {dancer.name?.charAt(0)?.toUpperCase() || '👤'}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 pt-safe">
          <Navbar
            transparent
            left={
              <NavbarBackLink
                onClick={() => navigate(-1)}
                className="text-white"
              />
            }
          />
        </div>

        {/* Status badges */}
        <div className="absolute top-16 right-4 flex flex-col gap-2">
          {dancer.is_matched && (
            <Chip className="!bg-green-500 !text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Dopasowanie!
            </Chip>
          )}
          {!dancer.is_matched && dancer.liked_me && (
            <Chip className="!bg-brand-500 !text-white">
              <Heart className="w-4 h-4 mr-1 fill-current" />
              Lubi Cię!
            </Chip>
          )}
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {dancer.is_verified && (
              <Chip className="!bg-blue-500 !text-white text-xs">
                <Award className="w-3 h-3 mr-1" />
                Zweryfikowany
              </Chip>
            )}
            {dancer.is_trainer && (
              <Chip className="!bg-purple-500 !text-white text-xs">
                <GraduationCap className="w-3 h-3 mr-1" />
                Trener
              </Chip>
            )}
          </div>

          <h1 className="text-3xl font-bold">
            {dancer.name}
            {dancer.age && <span className="font-normal">, {dancer.age}</span>}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-white/80">
            {dancer.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {dancer.city}
              </span>
            )}
            {dancer.height && (
              <span className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                {dancer.height} cm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {dancer.bio && (
        <>
          <BlockTitle>O mnie</BlockTitle>
          <Block>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {dancer.bio}
            </p>
          </Block>
        </>
      )}

      {/* Dance styles */}
      {dancer.dance_styles && dancer.dance_styles.length > 0 && (
        <>
          <BlockTitle>Style tańca ({dancer.dance_styles.length})</BlockTitle>
          <Block>
            <div className="space-y-3">
              {dancer.dance_styles.map((style, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <Music className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="font-medium">{style.style_name}</p>
                      <p className="text-sm text-gray-500">
                        {getSkillLevelLabel(style.skill_level)}
                      </p>
                    </div>
                  </div>
                  {style.is_teaching && (
                    <Chip className="!bg-purple-100 !text-purple-700 dark:!bg-purple-900/30 dark:!text-purple-300">
                      Uczy
                    </Chip>
                  )}
                </div>
              ))}
            </div>
          </Block>
        </>
      )}

      {/* Profile details */}
      <BlockTitle>Szczegóły</BlockTitle>
      <Block>
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Calendar className="w-5 h-5" />
          <span>
            Dołączył {formatDate(dancer.created_at)}
          </span>
        </div>
      </Block>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            large
            className={cn(
              'flex-1',
              dancer.i_liked
                ? '!bg-brand-500 active:!bg-brand-600'
                : '!bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white'
            )}
            onClick={handleLike}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
          >
            <Heart
              className={cn(
                'w-5 h-5 mr-2',
                dancer.i_liked && 'fill-current'
              )}
            />
            {dancer.i_liked ? 'Polubiono' : 'Polub'}
          </Button>

          <Button
            large
            className="flex-1 !bg-brand-500 active:!bg-brand-600"
            disabled={!dancer.is_matched}
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            {dancer.is_matched ? 'Napisz' : 'Najpierw dopasuj'}
          </Button>
        </div>
      </div>
    </div>
  )
}
