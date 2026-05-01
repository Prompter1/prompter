import { cn } from '@/src/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'free' | 'paid' | 'verified' | 'sponsor'
  className?: string
}

const VARIANT_STYLES: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-surface-700 text-surface-300',
  free: 'bg-emerald-500/15 text-emerald-400',
  paid: 'bg-brand-500/15 text-brand-400',
  verified: 'bg-emerald-500/10 text-emerald-400',
  sponsor: 'bg-amber-500/15 text-amber-400',
}

export function Badge({
  children,
  variant = 'default',
  className,
}: Readonly<BadgeProps>) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
