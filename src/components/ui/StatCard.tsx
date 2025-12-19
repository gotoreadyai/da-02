interface StatCardProps {
  value: number
  label: string
  icon: React.ElementType
}

export function StatCard({ value, label, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-[var(--color-bg)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-display-md text-[var(--color-text-primary)]">{value}</span>
        <div className="w-9 h-9 rounded-xl bg-[var(--color-brand-light)] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[var(--color-brand-dark)]" />
        </div>
      </div>
      <span className="text-caption">{label}</span>
    </div>
  )
}
