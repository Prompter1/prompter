import { ArrowRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  linkLabel?: string
  linkHref?: string
}

export function SectionHeader({ title, subtitle, linkLabel, linkHref }: SectionHeaderProps) {
  return (
    <div className="mb-12 flex items-end justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
        {subtitle && <p className="text-surface-400 mt-3">{subtitle}</p>}
      </div>

      {linkLabel && linkHref && (
        <a
          href={linkHref}
          className="text-brand-400 hover:text-brand-300 hidden items-center gap-1 text-sm font-medium transition-colors sm:flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}
