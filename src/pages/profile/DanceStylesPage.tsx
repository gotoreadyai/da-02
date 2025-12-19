import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Music, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useMyDanceStyles, useRemoveDanceStyle, useAddDanceStyle } from '@/features/profile/api'
import { useDanceStyles } from '@/features/events/api'
import { getSkillLevelLabel, cn } from '@/lib/utils'
import { LAYOUT, ROUNDED, LIST_ITEM, ICON_CONTAINER, ICON, STATE_ICON, GAP } from '@/lib/constants'

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
    <div className="pb-10">
      {/* Header */}
      <header className={LAYOUT.header}>
        <div className={cn('flex items-center mb-5', GAP.lg)}>
          <button
            onClick={() => navigate(-1)}
            aria-label="Wroc"
            className={cn(ICON_CONTAINER.md, 'bg-[var(--color-bg-card)] shadow-md flex items-center justify-center', ROUNDED.circle)}
          >
            <ArrowLeft className={ICON.md} />
          </button>
          <div>
            <h1 className="text-headline-lg">Style tanca</h1>
            <p className="text-caption">Zarzadzaj swoimi preferencjami</p>
          </div>
        </div>
      </header>

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
                <button
                  onClick={() => handleRemoveDanceStyle(style.id)}
                  aria-label={`Usun styl ${style.dance_style?.name}`}
                  className={cn(ICON_CONTAINER.md, 'text-[var(--color-accent-coral)] flex items-center justify-center', ROUNDED.circle)}
                >
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
            <p className="text-caption">Dodaj swoje ulubione style tanca</p>
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          disabled={availableStyles.length === 0}
          className={cn(
            'w-full mt-4 flex items-center justify-center py-4 bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-white/[0.06] text-headline-sm',
            GAP.sm,
            ROUNDED.card,
            availableStyles.length === 0 && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Plus className={ICON.md} />
          {availableStyles.length === 0 ? 'Dodales wszystkie style' : 'Dodaj styl tanca'}
        </button>
      </section>

      {/* Add Dance Style Modal - Bottom Sheet */}
      {showAddModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />

          {/* Bottom Sheet */}
          <div className="fixed left-0 right-0 bottom-0 z-50 bg-[var(--color-bg-card)] rounded-t-3xl" style={{ maxHeight: '85vh' }}>
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h3 className="text-headline-md">Dodaj styl tanca</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={cn(ICON_CONTAINER.md, 'bg-[var(--color-bg)] flex items-center justify-center', ROUNDED.circle)}
              >
                <X className={ICON.md} />
              </button>
            </div>

            {/* Content - scrollable */}
            <div className="px-5 overflow-y-auto pb-8" style={{ maxHeight: 'calc(85vh - 60px)' }}>
              <div className="mb-4">
                <label className="text-caption block mb-2">Wybierz styl</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={cn(
                        'p-3 text-left border transition-all relative',
                        ROUNDED.card,
                        selectedStyleId === style.id
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                          : 'border-white/[0.06] bg-[var(--color-bg)]'
                      )}
                    >
                      <span className="text-headline-sm block">{style.name}</span>
                      {style.category && (
                        <span className="text-caption text-xs">{style.category}</span>
                      )}
                      {selectedStyleId === style.id && (
                        <Check className={cn(ICON.sm, 'text-[var(--color-brand)] absolute top-2 right-2')} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pb-4">
                <label className="text-caption block mb-2">Poziom zaawansowania</label>
                <div className="space-y-2">
                  {SKILL_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedSkillLevel(level.value)}
                      className={cn(
                        'w-full p-3 text-left border transition-all flex items-center justify-between',
                        ROUNDED.card,
                        selectedSkillLevel === level.value
                          ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                          : 'border-white/[0.06] bg-[var(--color-bg)]'
                      )}
                    >
                      <span className="text-headline-sm">{level.label}</span>
                      {selectedSkillLevel === level.value && (
                        <Check className={cn(ICON.sm, 'text-[var(--color-brand)]')} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uczę tego stylu */}
              <div className="pb-4">
                <button
                  onClick={() => setIsTeaching(!isTeaching)}
                  className={cn(
                    'w-full p-4 text-left border transition-all flex items-center justify-between',
                    ROUNDED.card,
                    isTeaching
                      ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10'
                      : 'border-white/[0.06] bg-[var(--color-bg)]'
                  )}
                >
                  <div>
                    <span className="text-headline-sm block">Ucze tego stylu</span>
                    <span className="text-caption text-xs">Zaznacz jesli jestes instruktorem</span>
                  </div>
                  <div
                    className={cn(
                      'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                      isTeaching
                        ? 'bg-[var(--color-brand)] border-[var(--color-brand)]'
                        : 'border-white/30'
                    )}
                  >
                    {isTeaching && <Check className="w-4 h-4 text-white" />}
                  </div>
                </button>
              </div>

              {/* PRZYCISK DODAJ */}
              <div className="pt-4 pb-24">
                <div
                  onClick={handleAddDanceStyle}
                  style={{ backgroundColor: '#8B5CF6', color: 'white', width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 'bold', textAlign: 'center', cursor: 'pointer' }}
                >
                  {addDanceStyleMutation.isPending ? 'Dodawanie...' : 'DODAJ STYL'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
