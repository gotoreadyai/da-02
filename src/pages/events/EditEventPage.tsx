import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useEvent, useUpdateEvent, useDeleteEvent, useDanceStyles } from '@/features/events/api'
import { useAuthStore } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ROUNDED, ICON, LAYOUT } from '@/lib/constants'
import { FloatingActionBar, Button, IconButton, InputField, SelectField, SelectOption, Spinner, PageHeader } from '@/components/ui'

const EVENT_TYPES = [
  { value: 'lesson', label: 'Lekcja' },
  { value: 'workshop', label: 'Warsztaty' },
  { value: 'social', label: 'Potancowka' },
  { value: 'competition', label: 'Zawody' },
  { value: 'performance', label: 'Wystep' },
]

const SKILL_LEVELS = [
  { value: '', label: 'Dla kazdego' },
  { value: 'beginner', label: 'Poczatkujacy' },
  { value: 'intermediate', label: 'Sredniozaawansowany' },
  { value: 'advanced', label: 'Zaawansowany' },
  { value: 'professional', label: 'Profesjonalny' },
]

const LOCATION_TYPES = [
  { value: 'physical', label: 'Stacjonarne' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrydowe' },
]

const STATUSES = [
  { value: 'draft', label: 'Szkic' },
  { value: 'published', label: 'Opublikowane' },
  { value: 'cancelled', label: 'Odwolane' },
  { value: 'completed', label: 'Zakonczone' },
]

interface FormData {
  title: string
  description: string
  event_type: string
  dance_style_id: string
  start_at: string
  end_at: string
  location_type: string
  location_name: string
  address: string
  city: string
  online_platform: string
  online_link: string
  max_participants: string
  skill_level_min: string
  price: string
  requires_partner: boolean
  status: string
}

export function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state: { user: { id: string } | null }) => state.user)

  const { data: event, isLoading } = useEvent(id!)
  const { data: danceStyles } = useDanceStyles()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    event_type: 'lesson',
    dance_style_id: '',
    start_at: '',
    end_at: '',
    location_type: 'physical',
    location_name: '',
    address: '',
    city: '',
    online_platform: '',
    online_link: '',
    max_participants: '',
    skill_level_min: '',
    price: '0',
    requires_partner: false,
    status: 'published',
  })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (event) {
      const formatDateTimeLocal = (dateStr: string) => {
        const date = new Date(dateStr)
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
      }

      setForm({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || 'lesson',
        dance_style_id: event.dance_style_id || '',
        start_at: formatDateTimeLocal(event.start_at),
        end_at: formatDateTimeLocal(event.end_at),
        location_type: event.location_type || 'physical',
        location_name: event.location_name || '',
        address: event.address || '',
        city: event.city || '',
        online_platform: event.online_platform || '',
        online_link: event.online_link || '',
        max_participants: event.max_participants?.toString() || '',
        skill_level_min: event.skill_level_min || '',
        price: event.price?.toString() || '0',
        requires_partner: event.requires_partner || false,
        status: event.status || 'published',
      })
    }
  }, [event])

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!form.title || form.title.length < 5) {
      toast.error('Nazwa musi miec min. 5 znakow')
      return
    }

    updateMutation.mutate(
      {
        id: id!,
        title: form.title,
        description: form.description || undefined,
        event_type: form.event_type,
        dance_style_id: form.dance_style_id || undefined,
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString(),
        location_type: form.location_type,
        location_name: form.location_name || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        online_platform: form.online_platform || undefined,
        online_link: form.online_link || undefined,
        max_participants: form.max_participants ? parseInt(form.max_participants) : undefined,
        skill_level_min: form.skill_level_min || undefined,
        skill_level_max: form.skill_level_min || undefined,
        price: parseFloat(form.price) || 0,
        requires_partner: form.requires_partner,
        status: form.status,
      },
      {
        onSuccess: () => {
          toast.success('Wydarzenie zaktualizowane!')
          navigate(`/events/${id}`)
        },
        onError: () => {
          toast.error('Nie udalo sie zapisac')
        },
      }
    )
  }

  const handleDelete = () => {
    deleteMutation.mutate(id!, {
      onSuccess: () => {
        toast.success('Wydarzenie usuniete')
        navigate('/events')
      },
      onError: () => {
        toast.error('Nie udalo sie usunac')
      },
    })
  }

  if (isLoading) {
    return (
      <div className={LAYOUT.loadingState}>
        <Spinner size="lg" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-body-md mb-4">Nie znaleziono wydarzenia</p>
        <Button onClick={() => navigate('/events')}>Wroc do listy</Button>
      </div>
    )
  }

  if (event.organizer_id !== user?.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-body-md mb-4">Nie masz uprawnien do edycji</p>
        <Button onClick={() => navigate(`/events/${id}`)}>Wroc do wydarzenia</Button>
      </div>
    )
  }

  const danceStyleOptions = danceStyles?.map((s) => ({ value: s.id, label: s.name })) || []

  return (
    <div className={cn('min-h-screen bg-[var(--color-bg)]', LAYOUT.pageWithFAB)}>
      <PageHeader
        title="Edytuj wydarzenie"
        leftElement={
          <IconButton onClick={() => navigate(-1)}>
            <ArrowLeft className={ICON.md} />
          </IconButton>
        }
        rightElement={
          <IconButton variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className={ICON.md} />
          </IconButton>
        }
      />

      <div className={LAYOUT.formSectionPadded}>
        {/* Podstawowe */}
        <section className={cn('card-premium p-4', ROUNDED.card)}>
          <h2 className="text-headline-sm mb-4">Podstawowe informacje</h2>
          <div className="space-y-4">
            <div>
              <label className="text-caption block mb-2">Nazwa wydarzenia *</label>
              <InputField
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="text-caption block mb-2">Typ wydarzenia</label>
              <SelectField
                value={form.event_type}
                onChange={(v) => handleChange('event_type', v)}
                options={EVENT_TYPES}
              />
            </div>
            <div>
              <label className="text-caption block mb-2">Styl tanca</label>
              <SelectField
                value={form.dance_style_id}
                onChange={(v) => handleChange('dance_style_id', v)}
                options={danceStyleOptions}
                placeholder="Wybierz styl"
              />
            </div>
            <div>
              <label className="text-caption block mb-2">Opis</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={cn('w-full py-4 px-4 bg-[var(--color-bg)] text-body-md outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 transition-all resize-none', ROUNDED.input)}
              />
            </div>
          </div>
        </section>

        {/* Data i czas */}
        <section className={cn('card-premium p-4', ROUNDED.card)}>
          <h2 className="text-headline-sm mb-4">Data i czas</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-caption block mb-2">Poczatek *</label>
              <InputField
                type="datetime-local"
                value={form.start_at}
                onChange={(e) => handleChange('start_at', e.target.value)}
              />
            </div>
            <div>
              <label className="text-caption block mb-2">Koniec *</label>
              <InputField
                type="datetime-local"
                value={form.end_at}
                onChange={(e) => handleChange('end_at', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Lokalizacja */}
        <section className={cn('card-premium p-4', ROUNDED.card)}>
          <h2 className="text-headline-sm mb-4">Lokalizacja</h2>
          <div className="space-y-4">
            <div>
              <label className="text-caption block mb-2">Typ lokalizacji</label>
              <SelectField
                value={form.location_type}
                onChange={(v) => handleChange('location_type', v)}
                options={LOCATION_TYPES}
              />
            </div>
            {form.location_type === 'online' ? (
              <>
                <div>
                  <label className="text-caption block mb-2">Platforma</label>
                  <InputField
                    type="text"
                    value={form.online_platform}
                    onChange={(e) => handleChange('online_platform', e.target.value)}
                    placeholder="np. Zoom"
                  />
                </div>
                <div>
                  <label className="text-caption block mb-2">Link</label>
                  <InputField
                    type="url"
                    value={form.online_link}
                    onChange={(e) => handleChange('online_link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-caption block mb-2">Nazwa miejsca</label>
                  <InputField
                    type="text"
                    value={form.location_name}
                    onChange={(e) => handleChange('location_name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-caption block mb-2">Adres</label>
                  <InputField
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-caption block mb-2">Miasto</label>
                  <InputField
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Szczegoly */}
        <section className={cn('card-premium p-4', ROUNDED.card)}>
          <h2 className="text-headline-sm mb-4">Szczegoly</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption block mb-2">Cena (PLN)</label>
                <InputField
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="text-caption block mb-2">Max. uczestnikow</label>
                <InputField
                  type="number"
                  value={form.max_participants}
                  onChange={(e) => handleChange('max_participants', e.target.value)}
                  min="1"
                  placeholder="Bez limitu"
                />
              </div>
            </div>
            <div>
              <label className="text-caption block mb-2">Poziom</label>
              <SelectField
                value={form.skill_level_min}
                onChange={(v) => handleChange('skill_level_min', v)}
                options={SKILL_LEVELS}
              />
            </div>
            <SelectOption
              label="Wymagany partner"
              isSelected={form.requires_partner}
              onClick={() => handleChange('requires_partner', !form.requires_partner)}
              variant="checkbox"
            />
            <div>
              <label className="text-caption block mb-2">Status</label>
              <SelectField
                value={form.status}
                onChange={(v) => handleChange('status', v)}
                options={STATUSES}
              />
            </div>
          </div>
        </section>
      </div>

      <FloatingActionBar>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="max-w-md">
          {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </Button>
      </FloatingActionBar>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={cn('w-full max-w-sm bg-[var(--color-bg-card)] p-6', ROUNDED.card)}>
            <h3 className="text-headline-md mb-2">Usunac wydarzenie?</h3>
            <p className="text-caption mb-6">Tej operacji nie mozna cofnac.</p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                Anuluj
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending} className="flex-1">
                {deleteMutation.isPending ? 'Usuwanie...' : 'Usun'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
