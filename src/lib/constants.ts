// 2026 Gradient palette - Elegant warm tones
export const AVATAR_GRADIENTS = [
  'from-[#D4A574] via-[#C4956A] to-[#A67C52]', // Warm beige/gold
  'from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6]', // Deep purple
  'from-[#F472B6] via-[#EC4899] to-[#BE185D]', // Rose pink
  'from-[#C4B5A0] via-[#A89F91] to-[#8B8178]', // Taupe elegant
  'from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9]', // Violet
  'from-[#F59E0B] via-[#D97706] to-[#B45309]', // Amber gold
] as const

// Status-based gradients - każdy kolor coś oznacza
export const STATUS_GRADIENTS = {
  match: 'from-[#10B981] via-[#059669] to-[#047857]',      // Mint/Green - MATCH!
  likedMe: 'from-[#F43F5E] via-[#E11D48] to-[#BE123C]',   // Hot pink - ktoś Cię lubi
  trainer: 'from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6]',   // Purple - trener
  iLiked: 'from-[#F59E0B] via-[#D97706] to-[#B45309]',    // Amber - lubisz
  verified: 'from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]',  // Blue - zweryfikowany
  default: 'from-[#6B7280] via-[#4B5563] to-[#374151]',   // Gray - domyślny
} as const

export function getGradientForName(name: string | null | undefined): string {
  const charCode = name?.charCodeAt(0) || 0
  const gradientIndex = charCode % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[gradientIndex]
}

interface DancerStatus {
  is_matched?: boolean
  liked_me?: boolean
  is_trainer?: boolean
  i_liked?: boolean
  is_verified?: boolean
}

export function getGradientForStatus(dancer: DancerStatus): string {
  if (dancer.is_matched) return STATUS_GRADIENTS.match
  if (dancer.liked_me) return STATUS_GRADIENTS.likedMe
  if (dancer.is_trainer) return STATUS_GRADIENTS.trainer
  if (dancer.i_liked) return STATUS_GRADIENTS.iLiked
  if (dancer.is_verified) return STATUS_GRADIENTS.verified
  return STATUS_GRADIENTS.default
}

// ============================================
// UNIFIED DESIGN SYSTEM (Fibonacci-based)
// ============================================

// Layout spacing - USE THESE EVERYWHERE
export const LAYOUT = {
  // Page headers - MANDATORY for all pages
  header: 'px-5 pt-13 pb-5',
  headerCompact: 'px-5 pt-13 pb-3',
  // Sections
  section: 'px-5 mb-5',
  sectionLast: 'px-5',
  // Section headings
  sectionHeadingMargin: 'mb-3',
  // Horizontal scroll containers
  horizontalScroll: 'gap-3 px-5',
  horizontalScrollWrapper: 'flex overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide',
  // Page bottom padding (for floating action bars)
  pageWithFAB: 'pb-32',
  pageWithNav: 'pb-20',
  pageWithLargeFAB: 'pb-36',
  // Loading/empty states
  loadingState: 'flex items-center justify-center py-16',
  emptyState: 'py-20',
  // Form sections
  formSection: 'space-y-6 pt-6',
  formSectionPadded: 'space-y-6 pt-6 px-5',
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
  border: 'border-b border-white/[0.06]',
  // Hover/active states
  interactive: 'hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors',
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
  base: 'w-full bg-[var(--color-bg)] text-body-md outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 transition-all rounded-2xl',
  withIcon: 'pl-12 pr-4 py-4',
  standard: 'px-4 py-4',
} as const

// Buttons - STANDARDIZED
export const BUTTON = {
  primary: 'w-full py-4 rounded-2xl bg-[var(--color-brand)] text-white text-headline-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2',
  secondary: 'w-full py-4 rounded-2xl bg-gray-500/20 text-[var(--color-text-primary)] text-headline-sm transition-all disabled:text-[var(--color-text-tertiary)] flex items-center justify-center gap-2',
  danger: 'w-full py-4 rounded-2xl bg-red-500/10 text-red-400 text-headline-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2',
} as const

// Avatar sizes in context - STANDARDIZED
export const AVATAR_SIZE = {
  // List rows (dancers, chat, etc.)
  listRow: 'md',
} as const

// Featured cards - STANDARDIZED
export const FEATURED_CARD = {
  // Dancer cards (larger)
  dancer: 'w-52',
  // Event cards
  event: 'w-40',
  // Common styles
  base: 'flex-shrink-0 text-left active:scale-[0.97] transition-transform',
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
  error: 'bg-red-500/20',
  info: 'bg-[var(--color-brand)]/20',
} as const
