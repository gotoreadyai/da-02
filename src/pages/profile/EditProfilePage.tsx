import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { Avatar } from '@/components/ui/Avatar'
import { ArrowLeft, Camera, Trash2, Plus, Music, User, MapPin, Ruler, FileText, Shield, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { useMyProfile, useMyDanceStyles, useUpdateProfile, useUploadProfilePhoto, useRemoveDanceStyle } from '@/features/profile/api'
import { getSkillLevelLabel, cn } from '@/lib/utils'
import { LAYOUT, ROUNDED, LIST_ITEM, ICON_CONTAINER, ICON, TOGGLE, STATE_ICON, GAP, BUTTON } from '@/lib/constants'

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
          toast.error('Nie udalo sie zapisac')
        },
      }
    )
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Plik jest za duzy (max 5MB)')
      return
    }

    uploadPhotoMutation.mutate(file, {
      onSuccess: () => toast.success('Zdjecie zaktualizowane'),
      onError: () => toast.error('Nie udalo sie przeslac zdjecia'),
    })
  }

  const handleRemoveDanceStyle = (id: string) => {
    removeDanceStyleMutation.mutate(id, {
      onSuccess: () => toast.success('Styl usuniety'),
    })
  }

  if (!profile) return null

  return (
    <div className="pb-32">
      {/* Header */}
      <header className={LAYOUT.header}>
        <div className={cn('flex items-center mb-5', GAP.lg)}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Wroc"
            className={cn(ICON_CONTAINER.md, 'bg-white shadow-md flex items-center justify-center', ROUNDED.circle)}
          >
            <ArrowLeft className={ICON.md} />
          </button>
          <h1 className="text-headline-lg">Edytuj profil</h1>
        </div>

        {/* Profile photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={cn('ring-4 ring-[var(--color-brand-light)] shadow-lg', ROUNDED.circle)}>
              <Avatar src={profile.profile_photo_url} name={profile.name} size="2xl" shape="circle" alt={`Zdjecie profilowe ${profile.name}`} />
              {uploadPhotoMutation.isPending && (
                <div className={cn('absolute inset-0 bg-black/50 flex items-center justify-center', ROUNDED.circle)}>
                  <Spinner size="md" className="border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="Zmien zdjecie profilowe"
              className={cn(ICON_CONTAINER.md, 'absolute bottom-0 right-0 bg-[var(--color-brand)] text-white flex items-center justify-center shadow-lg', ROUNDED.circle)}
            >
              <Camera className={ICON.md} />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          <p className="text-caption mt-3">Dotknij, aby zmienic zdjecie</p>
        </div>
      </header>

      {/* Basic info */}
      <section className={LAYOUT.section}>
        <h2 className={cn('text-headline-md', LAYOUT.sectionHeadingMargin)}>Podstawowe informacje</h2>
        <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
          <div className={cn('flex items-center', LIST_ITEM.padding, LIST_ITEM.border)}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
              <User className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Imie</label>
              <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Twoje imie" className="w-full text-headline-sm bg-transparent outline-none" />
            </div>
          </div>

          <div className={cn('flex items-center', LIST_ITEM.padding, LIST_ITEM.border)}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
              <User className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Wiek</label>
              <input type="number" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="np. 25" className="w-full text-headline-sm bg-transparent outline-none" />
            </div>
          </div>

          <div className={cn('flex items-center', LIST_ITEM.padding, LIST_ITEM.border)}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
              <Ruler className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Wzrost (cm)</label>
              <input type="number" value={formData.height} onChange={(e) => handleChange('height', e.target.value)} placeholder="np. 175" className="w-full text-headline-sm bg-transparent outline-none" />
            </div>
          </div>

          <div className={cn('flex items-center', LIST_ITEM.padding)}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
              <MapPin className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
            </div>
            <div className="flex-1">
              <label className="text-caption block mb-1">Miasto</label>
              <input type="text" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="np. Warszawa" className="w-full text-headline-sm bg-transparent outline-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className={LAYOUT.section}>
        <h2 className={cn('text-headline-md', LAYOUT.sectionHeadingMargin)}>O mnie</h2>
        <div className={cn('card-premium p-4', ROUNDED.card)}>
          <div className={cn('flex items-start', GAP.lg)}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center flex-shrink-0')}>
              <FileText className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
            </div>
            <textarea value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} placeholder="Napisz cos o sobie..." rows={4} className="flex-1 text-body-md bg-transparent outline-none resize-none" />
          </div>
        </div>
      </section>

      {/* Privacy settings */}
      <section className={LAYOUT.section}>
        <h2 className={cn('text-headline-md', LAYOUT.sectionHeadingMargin)}>Prywatnosc</h2>
        <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
          <button onClick={() => handleChange('show_age', !formData.show_age)} className={cn('w-full flex items-center', LIST_ITEM.padding, LIST_ITEM.border, 'text-left')}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-bg)] flex items-center justify-center')}>
              <Shield className={cn(ICON.md, 'text-[var(--color-text-secondary)]')} />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Pokaz wiek</span>
              <span className="text-caption">Inni zobacza Twoj wiek</span>
            </div>
            <div className={cn(TOGGLE.track, formData.show_age ? TOGGLE.trackOn : TOGGLE.trackOff)}>
              <div className={cn(TOGGLE.thumb, formData.show_age ? TOGGLE.thumbOn : TOGGLE.thumbOff)} />
            </div>
          </button>

          <button onClick={() => handleChange('show_exact_location', !formData.show_exact_location)} className={cn('w-full flex items-center', LIST_ITEM.padding, LIST_ITEM.border, 'text-left')}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-bg)] flex items-center justify-center')}>
              <MapPin className={cn(ICON.md, 'text-[var(--color-text-secondary)]')} />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Dokladna lokalizacja</span>
              <span className="text-caption">Pokaz dokladne miasto</span>
            </div>
            <div className={cn(TOGGLE.track, formData.show_exact_location ? TOGGLE.trackOn : TOGGLE.trackOff)}>
              <div className={cn(TOGGLE.thumb, formData.show_exact_location ? TOGGLE.thumbOn : TOGGLE.thumbOff)} />
            </div>
          </button>

          <button onClick={() => handleChange('is_trainer', !formData.is_trainer)} className={cn('w-full flex items-center', LIST_ITEM.padding, 'text-left')}>
            <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-bg)] flex items-center justify-center')}>
              <GraduationCap className={cn(ICON.md, 'text-[var(--color-text-secondary)]')} />
            </div>
            <div className="flex-1">
              <span className="text-headline-sm block">Jestem trenerem</span>
              <span className="text-caption">Oznacz profil jako trener</span>
            </div>
            <div className={cn(TOGGLE.track, formData.is_trainer ? TOGGLE.trackOn : TOGGLE.trackOff)}>
              <div className={cn(TOGGLE.thumb, formData.is_trainer ? TOGGLE.thumbOn : TOGGLE.thumbOff)} />
            </div>
          </button>
        </div>
      </section>

      {/* Dance styles */}
      <section className={LAYOUT.section}>
        <h2 className={cn('text-headline-md', LAYOUT.sectionHeadingMargin)}>Style tanca</h2>

        {myDanceStyles && myDanceStyles.length > 0 ? (
          <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
            {myDanceStyles.map((style, index) => (
              <div key={style.id} className={cn('flex items-center', LIST_ITEM.padding, index !== myDanceStyles.length - 1 && LIST_ITEM.border)}>
                <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand-light)] flex items-center justify-center')}>
                  <Music className={cn(ICON.md, 'text-[var(--color-brand-dark)]')} />
                </div>
                <div className="flex-1">
                  <span className="text-headline-sm block">{style.dance_style?.name}</span>
                  <span className="text-caption">{getSkillLevelLabel(style.skill_level)}</span>
                </div>
                <button onClick={() => handleRemoveDanceStyle(style.id)} aria-label={`Usun styl ${style.dance_style?.name}`} className={cn(ICON_CONTAINER.md, 'text-[var(--color-accent-coral)] flex items-center justify-center', ROUNDED.circle)}>
                  <Trash2 className={ICON.md} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <div className={cn(STATE_ICON.container, 'bg-[var(--color-bg)]')}>
              <Music className={cn(ICON.lg, 'text-[var(--color-text-tertiary)]')} />
            </div>
            <h3 className="text-headline-sm mb-1">Brak stylow</h3>
            <p className="text-caption">Nie dodano zadnych stylow tanca</p>
          </div>
        )}

        <button className={cn('w-full mt-4 flex items-center justify-center py-4 bg-[var(--color-bg)] text-[var(--color-text-primary)] border border-black/[0.04] text-headline-sm', GAP.sm, ROUNDED.card)}>
          <Plus className={ICON.md} />
          Dodaj styl tanca
        </button>
      </section>

      {/* Fixed bottom save button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-black/[0.04]">
        <div className="max-w-lg mx-auto">
          <button onClick={handleSave} disabled={updateMutation.isPending} className={BUTTON.primary}>
            {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
