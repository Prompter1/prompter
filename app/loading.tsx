import { Sparkles } from 'lucide-react'

export default function Loading() {
  return (
    <main className="bg-surface-900 min-h-screen px-4 pt-28 pb-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-brand-500/15 flex h-12 w-12 items-center justify-center rounded-2xl">
            <Sparkles className="text-brand-400 h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="bg-surface-700 h-4 w-40 animate-pulse rounded" />
            <div className="bg-surface-800 mt-2 h-3 w-64 animate-pulse rounded" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border-surface-700/50 bg-surface-800/40 overflow-hidden rounded-2xl border"
            >
              <div className="bg-surface-700/50 aspect-4/3 animate-pulse" />
              <div className="space-y-3 p-5">
                <div className="bg-surface-700 h-3 w-24 animate-pulse rounded" />
                <div className="bg-surface-700 h-4 w-full animate-pulse rounded" />
                <div className="bg-surface-800 h-4 w-2/3 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
