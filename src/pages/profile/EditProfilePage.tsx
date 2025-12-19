import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  NavbarBackLink,
  List,
  ListInput,
  ListItem,
  Block,
  BlockTitle,
  Button,
  Toggle,
  Preloader,
} from 'konsta/react'
import { Camera, Trash2, Plus, Music } from 'lucide-react'
import { toast } from 'sonner'
import {
  useMyProfile,
  useMyDanceStyles,
  useUpdateProfile,
  useUploadProfilePhoto,
  useRemoveDanceStyle,
} from '@/features/profile/api'
import { useDanceStyles } from '@/features/events/api'
import { getSkillLevelLabel, getInitials } from '@/lib/utils'

export function EditProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profile } = useMyProfile()
  const { data: myDanceStyles } = useMyDanceStyles()
  const { data: allDanceStyles } = useDanceStyles()

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
    <div className="pb-32">
      <Navbar
        left={<NavbarBackLink onClick={() => navigate(-1)} />}
        title="Edytuj profil"
      />

      {/* Profile photo */}
      <Block>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center overflow-hidden">
              {profile.profile_photo_url ? (
                <img
                  src={profile.profile_photo_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-brand-600">
                  {getInitials(profile.name)}
                </span>
              )}

              {uploadPhotoMutation.isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Preloader className="text-white" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg"
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

          <p className="text-sm text-gray-500 mt-2">
            Dotknij, aby zmienić zdjęcie
          </p>
        </div>
      </Block>

      {/* Basic info */}
      <BlockTitle>Podstawowe informacje</BlockTitle>
      <List strongIos insetIos>
        <ListInput
          label="Imię"
          type="text"
          placeholder="Twoje imię"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <ListInput
          label="Wiek"
          type="number"
          placeholder="np. 25"
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
        />
        <ListInput
          label="Wzrost (cm)"
          type="number"
          placeholder="np. 175"
          value={formData.height}
          onChange={(e) => handleChange('height', e.target.value)}
        />
        <ListInput
          label="Miasto"
          type="text"
          placeholder="np. Warszawa"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />
      </List>

      {/* Bio */}
      <BlockTitle>O mnie</BlockTitle>
      <List strongIos insetIos>
        <ListInput
          label="Bio"
          type="textarea"
          placeholder="Napisz coś o sobie..."
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          inputClassName="!h-32"
        />
      </List>

      {/* Privacy settings */}
      <BlockTitle>Prywatność</BlockTitle>
      <List strongIos insetIos>
        <ListItem
          title="Pokaż wiek"
          after={
            <Toggle
              checked={formData.show_age}
              onChange={() => handleChange('show_age', !formData.show_age)}
            />
          }
        />
        <ListItem
          title="Pokaż dokładną lokalizację"
          after={
            <Toggle
              checked={formData.show_exact_location}
              onChange={() =>
                handleChange('show_exact_location', !formData.show_exact_location)
              }
            />
          }
        />
        <ListItem
          title="Jestem trenerem"
          after={
            <Toggle
              checked={formData.is_trainer}
              onChange={() => handleChange('is_trainer', !formData.is_trainer)}
            />
          }
        />
      </List>

      {/* Dance styles */}
      <BlockTitle>Style tańca</BlockTitle>
      <Block>
        {myDanceStyles && myDanceStyles.length > 0 ? (
          <div className="space-y-3">
            {myDanceStyles.map((style) => (
              <div
                key={style.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                    <Music className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium">{style.dance_style?.name}</p>
                    <p className="text-sm text-gray-500">
                      {getSkillLevelLabel(style.skill_level)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDanceStyle(style.id)}
                  className="w-10 h-10 rounded-full text-red-500 flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Music className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Nie dodano żadnych stylów</p>
          </div>
        )}

        <Button
          className="w-full mt-4 !bg-gray-100 dark:!bg-gray-800 !text-gray-900 dark:!text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Dodaj styl tańca
        </Button>
      </Block>

      {/* Save button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-lg mx-auto">
          <Button
            large
            className="w-full !bg-brand-500 active:!bg-brand-600"
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </div>
      </div>
    </div>
  )
}
