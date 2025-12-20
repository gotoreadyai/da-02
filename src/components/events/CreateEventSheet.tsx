import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Music, Star, PartyPopper, Trophy, Mic } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateEvent, useDanceStyles } from '@/features/events/api'
import { cn } from '@/lib/utils'
import { ICON } from '@/lib/constants'
import { BottomSheet, Button, InputField, SelectOption, SelectGridOption } from '@/components/ui'

const EVENT_TYPES = [
  { value: 'lesson', label: 'Lekcja', icon: Music },
  { value: 'workshop', label: 'Warsztaty', icon: Star },
  { value: 'social', label: 'Potancowka', icon: PartyPopper },
  { value: 'competition', label: 'Zawody', icon: Trophy },
  { value: 'performance', label: 'Wystep', icon: Mic },
]

const SKILL_LEVELS = [
  { value: '', label: 'Dla kazdego' },
  { value: 'beginner', label: 'Poczatkujacy' },
  { value: 'intermediate', label: 'Sredniozaawansowany' },
  { value: 'advanced', label: 'Zaawansowany' },
]

interface CreateEventSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateEventSheet({ isOpen, onClose }: CreateEventSheetProps) {
  const navigate = useNavigate()
  const { data: danceStyles } = useDanceStyles()
  const createMutation = useCreateEvent()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    title: '',
    event_type: 'lesson',
    dance_style_id: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location_name: '',
    city: '',
    skill_level: '',
    price: '0',
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreate = () => {
    if (!form.title || form.title.length < 5) {
      toast.error('Nazwa musi miec min. 5 znakow')
      return
    }
    if (!form.event_date || !form.start_time || !form.end_time) {
      toast.error('Wybierz date i godziny')
      return
    }

    const startAt = new Date(`${form.event_date}T${form.start_time}`)
    const endAt = new Date(`${form.event_date}T${form.end_time}`)

    createMutation.mutate(
      {
        title: form.title,
        event_type: form.event_type,
        dance_style_id: form.dance_style_id || undefined,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        location_type: 'physical',
        location_name: form.location_name || undefined,
        city: form.city || undefined,
        skill_level_min: form.skill_level || undefined,
        price: parseFloat(form.price) || 0,
        status: 'published',
      },
      {
        onSuccess: (data) => {
          toast.success('Wydarzenie utworzone!')
          onClose()
          setStep(1)
          setForm({
            title: '',
            event_type: 'lesson',
            dance_style_id: '',
            event_date: '',
            start_time: '',
            end_time: '',
            location_name: '',
            city: '',
            skill_level: '',
            price: '0',
          })
          navigate(`/events/${data.id}`)
        },
        onError: () => {
          toast.error('Nie udalo sie utworzyc')
        },
      }
    )
  }

  const canProceed = () => {
    if (step === 1) return form.title.length >= 5
    if (step === 2) return form.event_date && form.start_time && form.end_time
    return true
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Nowe wydarzenie">
      <div className="space-y-6">
        {/* Step indicators */}
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                s === step ? 'w-8 bg-[var(--color-brand)]' : 'bg-white/20'
              )}
            />
          ))}
        </div>

        {/* Step 1: Podstawy */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-caption block mb-2">Nazwa wydarzenia *</label>
              <InputField
                type="text"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="np. Bachata dla poczatkujacych"
              />
            </div>

            <div>
              <label className="text-caption block mb-2">Typ wydarzenia</label>
              <div className="grid grid-cols-3 gap-2">
                {EVENT_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleChange('event_type', type.value)}
                      className={cn(
                        'p-3 flex flex-col items-center gap-1 border rounded-xl transition-all',
                        form.event_type === type.value
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                          : 'border-white/[0.06] bg-[var(--color-bg)]'
                      )}
                    >
                      <Icon className={ICON.md} />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-caption block mb-2">Styl tanca</label>
              <div className="grid grid-cols-2 gap-2">
                {danceStyles?.slice(0, 6).map((style) => (
                  <SelectGridOption
                    key={style.id}
                    label={style.name}
                    isSelected={form.dance_style_id === style.id}
                    onClick={() => handleChange('dance_style_id', style.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Termin */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-caption block mb-2">Data *</label>
              <InputField
                type="date"
                value={form.event_date}
                onChange={(e) => handleChange('event_date', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-caption block mb-2">Od *</label>
                <InputField
                  type="time"
                  value={form.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                />
              </div>
              <div>
                <label className="text-caption block mb-2">Do *</label>
                <InputField
                  type="time"
                  value={form.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-caption block mb-2">Miasto</label>
              <InputField
                type="text"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="np. Warszawa"
              />
            </div>

            <div>
              <label className="text-caption block mb-2">Miejsce</label>
              <InputField
                type="text"
                value={form.location_name}
                onChange={(e) => handleChange('location_name', e.target.value)}
                placeholder="np. Studio Tanca XYZ"
              />
            </div>
          </div>
        )}

        {/* Step 3: Szczegoly */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-caption block mb-2">Poziom</label>
              <div className="space-y-2">
                {SKILL_LEVELS.map((level) => (
                  <SelectOption
                    key={level.value}
                    label={level.label}
                    isSelected={form.skill_level === level.value}
                    onClick={() => handleChange('skill_level', level.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-caption block mb-2">Cena (PLN)</label>
              <InputField
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                min="0"
                placeholder="0 = darmowe"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4 pb-16">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">
              Wstecz
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="flex-1">
              Dalej
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? 'Tworzenie...' : 'Utworz wydarzenie'}
            </Button>
          )}
        </div>
      </div>
    </BottomSheet>
  )
}
