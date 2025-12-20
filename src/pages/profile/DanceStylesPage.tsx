import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Music } from 'lucide-react'
import { toast } from 'sonner'
import { useMyDanceStyles, useRemoveDanceStyle, useAddDanceStyle } from '@/features/profile/api'
import { useDanceStyles } from '@/features/events/api'
import { getSkillLevelLabel, cn } from '@/lib/utils'
import { LAYOUT, ROUNDED, LIST_ITEM, ICON_CONTAINER, ICON, STATE_ICON } from '@/lib/constants'
import { Button, IconButton, PageHeader, BottomSheet, SelectOption, SelectGridOption } from '@/components/ui'

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Poczatkujacy' },
  { value: 'intermediate', label: 'Sredniozaawansowany' },
  { value: 'advanced', label: 'Zaawansowany' },
  { value: 'professional', label: 'Profesjonalny' },
]

export function DanceStylesPage() {
  const navigate = useNavigate()

  const { data: myDanceStyles } = useMyDanceStyles()
  const { data: allDanceStyles } = useDanceStyles()

  const removeDanceStyleMutation = useRemoveDanceStyle()
  const addDanceStyleMutation = useAddDanceStyle()

  // Modal state for adding dance style
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null)
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string | null>(null)
  const [isTeaching, setIsTeaching] = useState(false)

  const handleRemoveDanceStyle = (id: string) => {
    removeDanceStyleMutation.mutate(id, {
      onSuccess: () => toast.success('Styl usuniety'),
      onError: () => toast.error('Nie udalo sie usunac stylu'),
    })
  }

  const handleAddDanceStyle = () => {
    if (!selectedStyleId || !selectedSkillLevel) {
      toast.error('Wybierz styl i poziom')
      return
    }

    addDanceStyleMutation.mutate(
      {
        dance_style_id: selectedStyleId,
        skill_level: selectedSkillLevel,
        is_teaching: isTeaching,
      },
      {
        onSuccess: () => {
          toast.success('Styl dodany')
          setShowAddModal(false)
          setSelectedStyleId(null)
          setSelectedSkillLevel(null)
          setIsTeaching(false)
        },
        onError: () => toast.error('Nie udalo sie dodac stylu'),
      }
    )
  }

  // Filter out already added styles
  const availableStyles = allDanceStyles?.filter(
    (style) => !myDanceStyles?.some((my) => my.dance_style_id === style.id)
  ) || []

  return (
    <div>
      <PageHeader
        title="Style tanca"
        subtitle="Zarzadzaj swoimi preferencjami"
        leftElement={
          <IconButton onClick={() => navigate(-1)} aria-label="Wroc">
            <ArrowLeft className={ICON.md} />
          </IconButton>
        }
      />

      {/* Dance styles list */}
      <section className={LAYOUT.section}>
        {myDanceStyles && myDanceStyles.length > 0 ? (
          <div className={cn('card-premium overflow-hidden', ROUNDED.card)}>
            {myDanceStyles.map((style, index) => (
              <div key={style.id} className={cn('flex items-center', LIST_ITEM.padding, index !== myDanceStyles.length - 1 && LIST_ITEM.border)}>
                <div className={cn(ICON_CONTAINER.lg, 'bg-[var(--color-brand)]/20 flex items-center justify-center')}>
                  <Music className={cn(ICON.md, 'text-[var(--color-brand)]')} />
                </div>
                <div className="flex-1">
                  <span className="text-headline-sm block">{style.dance_style?.name}</span>
                  <span className="text-caption">{getSkillLevelLabel(style.skill_level)}</span>
                </div>
                <IconButton
                  variant="danger"
                  onClick={() => handleRemoveDanceStyle(style.id)}
                  aria-label={`Usun styl ${style.dance_style?.name}`}
                >
                  <Trash2 className={ICON.md} />
                </IconButton>
              </div>
            ))}
          </div>
        ) : (
          <div className={cn('card-premium p-8 text-center', ROUNDED.card)}>
            <div className={cn(STATE_ICON.container, 'bg-[var(--color-bg)]')}>
              <Music className={cn(ICON.lg, 'text-[var(--color-text-tertiary)]')} />
            </div>
            <h3 className="text-headline-sm mb-1">Brak stylow</h3>
            <p className="text-caption">Dodaj swoje ulubione style tanca</p>
          </div>
        )}

        <Button
          onClick={() => setShowAddModal(true)}
          disabled={availableStyles.length === 0}
          variant="secondary"
          className="mt-4"
        >
          <Plus className={ICON.md} />
          {availableStyles.length === 0 ? 'Dodales wszystkie style' : 'Dodaj styl tanca'}
        </Button>
      </section>

      <BottomSheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Dodaj styl tanca"
      >
        <div className="space-y-6">
          <div>
            <label className="text-caption block mb-2">Wybierz styl</label>
            <div className="grid grid-cols-2 gap-2">
              {availableStyles.map((style) => (
                <SelectGridOption
                  key={style.id}
                  label={style.name}
                  subtitle={style.category}
                  isSelected={selectedStyleId === style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-caption block mb-2">Poziom zaawansowania</label>
            <div className="space-y-2">
              {SKILL_LEVELS.map((level) => (
                <SelectOption
                  key={level.value}
                  label={level.label}
                  isSelected={selectedSkillLevel === level.value}
                  onClick={() => setSelectedSkillLevel(level.value)}
                />
              ))}
            </div>
          </div>

          <SelectOption
            label="Ucze tego stylu"
            subtitle="Zaznacz jesli jestes instruktorem"
            isSelected={isTeaching}
            onClick={() => setIsTeaching(!isTeaching)}
            variant="checkbox"
          />

          <div className="pt-4 pb-16">
            <Button onClick={handleAddDanceStyle} disabled={addDanceStyleMutation.isPending}>
              {addDanceStyleMutation.isPending ? 'Dodawanie...' : 'Dodaj styl'}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
