import { cn, getInitials } from '@/lib/utils'
import { getGradientForName } from '@/lib/constants'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type AvatarShape = 'circle' | 'rounded'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  shape?: AvatarShape
  className?: string
  alt?: string
}

const sizeClasses: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-8 h-8', text: 'text-xs' },
  sm: { container: 'w-10 h-10', text: 'text-sm' },
  md: { container: 'w-11 h-11', text: 'text-base' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-2xl' },
  '2xl': { container: 'w-28 h-28', text: 'text-3xl' },
}

const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
}

export function Avatar({
  src,
  name,
  size = 'md',
  shape = 'rounded',
  className,
  alt,
}: AvatarProps) {
  const gradient = getGradientForName(name)
  const sizeClass = sizeClasses[size]
  const shapeClass = shapeClasses[shape]

  return (
    <div
      className={cn(
        'overflow-hidden flex-shrink-0',
        sizeClass.container,
        shapeClass,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'w-full h-full flex items-center justify-center bg-gradient-to-br',
            gradient
          )}
        >
          <span className={cn('font-semibold text-white/90', sizeClass.text)}>
            {getInitials(name || '?')}
          </span>
        </div>
      )}
    </div>
  )
}
