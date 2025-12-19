import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { ArrowLeft, Camera, Trash2, Plus, Music, User, MapPin, Ruler, FileText, Shield, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import {
  useMyProfile,
  useMyDanceStyles,
  useUpdateProfile,
  useUploadProfilePhoto,
  useRemoveDanceStyle,
} from '@/features/profile/api'
import { getSkillLevelLabel } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function EditProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profile } = useMyProfile()
  const { data: myDanceStyles } = useMyDanceStyles()

  const updateMutation = useUpdateProfile()
  const uploadPhotoMutation = useUploadProfilePhoto()
  const removeDanceStyleMutation = useRemoveDanceStyle()

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    age: profile?.age?.toString() || '',
    height: profile?.height?.toString() || '',
    city: profile?.city || '',
    show_age: profile?.show_age ?? true,
    show_exact_location: profile?.show_exact_location ?? false,
    is_trainer: profile?.is_trainer ?? false,
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateMutation.mutate(
      {
        name: formData.name,
        bio: formData.bio || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseInt(formData.height) : undefined,
        city: formData.city || undefined,
        show_age: formData.show_age,
        show_exact_location: formData.show_exact_location,
        is_trainer: formData.is_trainer,
      },
      {
        onSuccess: () => {
          toast.success('Profil zaktualizowany')
          navigate('/profile')
        },
        onError: () => {
          toast.error('Nie udało się zapisać')
        },
      }
    )
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Plik jest za duży (max 5MB)')
      return
    }

    uploadPhotoMutation.mutate(file, {
      onSuccess: () => {
        toast.success('Zdjęcie zaktualizowane')
      },
      onError: () => {
        toast.error('Nie udało się przesłać zdjęcia')
      },
    })
  }

  const handleRemoveDanceStyle = (id: string) => {
    removeDanceStyleMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Styl usunięty')
      },
    })
  }

  if (!profile) return null

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            aria-label="Wróć"
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <h1 className="text-headline-lg">Edytuj profil</h1>
        </div>

        {/* Profile photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="ring-4 ring-[var(--color-brand-light)] shadow-lg rounded-full">
              <Avatar
                src={profile.profile_photo_url}
                name={profile.name}
                size="2xl"
                shape="circle"
                alt={`Zdjęcie profilowe ${profile.name}`}
              />
              {uploadPhotoMutation.isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <Spinner size="md" className="border-white border-t-transparent" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Zmień zdjęcie profilowe"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center shadow-lg"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <p className="text-caption mt-3">Dotknij, aby zmienić zdjęcie</p>
        </div>
      </header>

      {/* Basic info */}
      <section className="px-6 mb-6">
        <h2 className="text-headline-md mb-4">Podstawowe informacje</h2>
        <div className="card-premium overflow-hidden">
          {/* Name */}
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--color-brand-dark)]" />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Imię</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Twoje imię"
                className="w-full text-headline-sm bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--color-brand-dark)]" />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Wiek</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="np. 25"
                className="w-full text-headline-sm bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Height */}
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[var(--color-brand-dark)]" />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Wzrost (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="np. 175"
                className="w-full text-headline-sm bg-transparent outline-none"
              />
            </div>
          </div>

          {/* City */}
          <div className="flex items-center gap-4 p-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--color-brand-dark)]" />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Miasto</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="np. Warszawa"
                className="w-full text-headline-sm bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-6 mb-6">
        <h2 className="text-headline-md mb-4">O mnie</h2>
        <div className="card-premium p-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[var(--color-brand-dark)]" />
            </div>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Napisz coś o sobie..."
              rows={4}
              className="flex-1 text-body-md bg-transparent outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Privacy settings */}
      <section className="px-6 mb-6">
        <h2 className="text-headline-md mb-4">Prywatność</h2>
        <div className="card-premium overflow-hidden">
          {/* Show age */}
          <button
            onClick={() => handleChange('show_age', !formData.show_age)}
            className="w-full flex items-center gap-4 p-4 border-b border-black/[0.04] text-left"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Pokaż wiek</span>
              <span className="text-caption">Inni zobaczą Twój wiek</span>
            </div>
            <div className={cn(
              'w-12 h-7 rounded-full transition-colors relative',
              formData.show_age ? 'bg-[var(--color-brand)]' : 'bg-black/20'
            )}>
              <div className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                formData.show_age ? 'translate-x-6' : 'translate-x-1'
              )} />
            </div>
          </button>

          {/* Show location */}
          <button
            onClick={() => handleChange('show_exact_location', !formData.show_exact_location)}
            className="w-full flex items-center gap-4 p-4 border-b border-black/[0.04] text-left"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Dokładna lokalizacja</span>
              <span className="text-caption">Pokaż dokładne miasto</span>
            </div>
            <div className={cn(
              'w-12 h-7 rounded-full transition-colors relative',
              formData.show_exact_location ? 'bg-[var(--color-brand)]' : 'bg-black/20'
            )}>
              <div className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                formData.show_exact_location ? 'translate-x-6' : 'translate-x-1'
              )} />
            </div>
          </button>

          {/* Is trainer */}
          <button
            onClick={() => handleChange('is_trainer', !formData.is_trainer)}
            className="w-full flex items-center gap-4 p-4 text-left"
          >
            <div className="w-11 h-11 rounded-2xl bg-[var(--color-bg)] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Jestem trenerem</span>
              <span className="text-caption">Oznacz profil jako trener</span>
            </div>
            <div className={cn(
              'w-12 h-7 rounded-full transition-colors relative',
              formData.is_trainer ? 'bg-[var(--color-brand)]' : 'bg-black/20'
            )}>
              <div className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
                formData.is_trainer ? 'translate-x-6' : 'translate-x-1'
              )} />
            </div>
          </button>
        </div>
      </section>

      {/* Dance styles */}
      <section className="px-6 mb-6">
        <h2 className="text-headline-md mb-4">Style tańca</h2>

        {myDanceStyles && myDanceStyles.length > 0 ? (
          <div className="card-premium overflow-hidden">
            {myDanceStyles.map((style, index) => (
              <div
                key={style.id}
                className={cn(
                  'flex items-center gap-4 p-4',
                  index !== myDanceStyles.length - 1 && 'border-b border-black/[0.04]'
                )}
              >
                <div className="w-11 h-11 rounded-2xl bg-[var(--color-brand-light)] flex items-center justify-center">
                  <Music className="w-5 h-5 text-[var(--color-brand-dark)]" />
                </div>
                <div className="flex-1">
                  <span className="text-headline-sm block">{style.dance_style?.name}</span>
                  <span className="text-caption">{getSkillLevelLabel(style.skill_level)}</span>
                </div>
                <button
                  onClick={() => handleRemoveDanceStyle(style.id)}
                  aria-label={`Usuń styl ${style.dance_style?.name}`}
                  className="w-10 h-10 rounded-full text-[var(--color-accent-coral)] flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg)] flex items-center justify-center mx-auto mb-4">
              <Music className="w-7 h-7 text-[var(--color-text-tertiary)]" />
            </div>
            <h3 className="text-headline-sm mb-1">Brak stylów</h3>
            <p className="text-caption">Nie dodano żadnych stylów tańca</p>
          </div>
        )}

        <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-black/[0.04] text-headline-sm">
          <Plus className="w-5 h-5" />
          Dodaj styl tańca
        </button>
      </section>

      {/* Fixed bottom save button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm transition-all disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
