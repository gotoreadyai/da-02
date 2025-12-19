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
