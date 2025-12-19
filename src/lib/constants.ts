// 2026 Gradient palette - ELECTRIC
export const AVATAR_GRADIENTS = [
  'from-[#8B5CF6] via-[#EC4899] to-[#F97316]', // Sunset violet
  'from-[#06B6D4] via-[#3B82F6] to-[#8B5CF6]', // Ocean to violet
  'from-[#F97316] via-[#EF4444] to-[#EC4899]', // Fire
  'from-[#10B981] via-[#06B6D4] to-[#3B82F6]', // Teal dream
  'from-[#EC4899] via-[#8B5CF6] to-[#06B6D4]', // Pink to cyan
  'from-[#FBBF24] via-[#F97316] to-[#EF4444]', // Gold fire
] as const

export function getGradientForName(name: string | null | undefined): string {
  const charCode = name?.charCodeAt(0) || 0
  const gradientIndex = charCode % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[gradientIndex]
}

// ============================================
// UNIFIED DESIGN SYSTEM (Fibonacci-based)
// ============================================

// Layout spacing - USE THESE EVERYWHERE
export const LAYOUT = {
  // Page headers - MANDATORY for all pages
  header: 'px-5 pt-13 pb-5',
  // Sections
  section: 'px-5 mb-5',
  sectionLast: 'px-5',
  // Section headings
  sectionHeadingMargin: 'mb-3',
  // Horizontal scroll containers
  horizontalScroll: 'gap-3 px-5',
  // Floating action buttons
  floatingAction: 'fixed bottom-21 left-5 right-5 z-20',
} as const

// Rounded corners - STANDARDIZED
export const ROUNDED = {
  // Cards and large containers
  card: 'rounded-2xl',
  // Buttons
  button: 'rounded-2xl',
  // Icon containers (large 11x11)
  iconLg: 'rounded-2xl',
  // Icon containers (medium 9-10px)
  iconMd: 'rounded-xl',
  // Badges
  badge: 'rounded-lg',
  // Avatar rounded style
  avatarRounded: 'rounded-xl',
  // Circular elements
  circle: 'rounded-full',
  // Input fields
  input: 'rounded-2xl',
  // Filter pills
  pill: 'rounded-xl',
} as const

// List items - STANDARDIZED
export const LIST_ITEM = {
  // Padding and gap for list rows
  padding: 'p-4 gap-4',
  // Compact padding for denser lists
  paddingCompact: 'p-3 gap-3',
  // Border between items
  border: 'border-b border-black/[0.04]',
  // Hover/active states
  interactive: 'hover:bg-black/[0.02] active:bg-black/[0.04] transition-colors',
} as const

// Icon containers - STANDARDIZED sizes
export const ICON_CONTAINER = {
  // Large icon container (profile/settings rows)
  lg: 'w-11 h-11 rounded-2xl',
  // Medium icon container (detail rows)
  md: 'w-10 h-10 rounded-xl',
  // Small icon container (inline)
  sm: 'w-9 h-9 rounded-xl',
  // Extra small (indicators)
  xs: 'w-6 h-6 rounded-lg',
} as const

// Badges - STANDARDIZED
export const BADGE = {
  // Standard text badge
  standard: 'px-2 py-1 rounded-lg text-[10px] font-bold',
  // Small inline badge
  inline: 'px-1.5 py-0.5 rounded-lg text-[9px] font-bold',
  // Icon badge
  icon: 'w-6 h-6 rounded-lg flex items-center justify-center',
  // Status indicator (circular)
  indicator: 'w-4 h-4 rounded-full',
} as const

// Gaps - STANDARDIZED (Fibonacci)
export const GAP = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
} as const

// Spacing - STANDARDIZED (Fibonacci)
export const SPACING = {
  stack: 'space-y-4',
  stackLg: 'space-y-5',
  sectionGap: 'mb-5',
  headingGap: 'mb-3',
} as const

// Form inputs - STANDARDIZED
export const INPUT = {
  base: 'w-full bg-[var(--color-bg)] text-body-md outline-none focus:ring-2 focus:ring-[var(--color-brand-light)] transition-all rounded-2xl',
  withIcon: 'pl-12 pr-4 py-4',
  standard: 'px-4 py-4',
} as const

// Buttons - STANDARDIZED
export const BUTTON = {
  primary: 'w-full py-4 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm transition-all disabled:opacity-50 flex items-center justify-center',
  secondary: 'w-full py-4 rounded-2xl bg-[var(--color-bg)] text-[var(--color-text-primary)] text-headline-sm transition-all',
  danger: 'w-full p-4 rounded-2xl bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors flex items-center justify-center gap-3',
} as const

// Avatar sizes in context - STANDARDIZED
export const AVATAR_SIZE = {
  // List rows (dancers, chat, etc.)
  listRow: 'md',
} as const

// Icon sizes - STANDARDIZED
export const ICON = {
  xxs: 'w-2.5 h-2.5',
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const

// Toggle switch - STANDARDIZED
export const TOGGLE = {
  track: 'w-12 h-7 rounded-full transition-colors relative',
  trackOn: 'bg-[var(--color-brand)]',
  trackOff: 'bg-black/20',
  thumb: 'absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform',
  thumbOn: 'translate-x-6',
  thumbOff: 'translate-x-1',
} as const

// Logo container
export const LOGO = {
  container: 'w-20 h-20 rounded-full',
} as const

// Success/info states
export const STATE_ICON = {
  container: 'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center',
  success: 'bg-[var(--color-accent-mint)]/20',
  error: 'bg-red-100',
  info: 'bg-[var(--color-brand-light)]',
} as const
