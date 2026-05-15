import { Sparkles } from 'lucide-react'

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/8 ${className}`} />
}

export default function Loading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_30%),linear-gradient(to_bottom,#05070d,#090b12_20%,#07090f_100%)] px-4 pt-28 pb-16 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-brand-500/10 absolute -top-32 right-0 h-80 w-80 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <Sparkles className="text-brand-400 h-6 w-6 animate-pulse" />
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-44" />
            <SkeletonBlock className="h-3 w-72" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] lg:items-start">
          <div className="space-y-6">
            <div className="bg-surface-900/90 overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <SkeletonBlock className="aspect-[16/10] w-full rounded-none bg-white/[0.04]" />

              <div className="space-y-4 p-5">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-7 w-24 rounded-full" />
                  <SkeletonBlock className="h-7 w-16 rounded-full" />
                  <SkeletonBlock className="h-7 w-20 rounded-full" />
                </div>

                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-4 w-1/2" />

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                  <SkeletonBlock className="h-20 rounded-2xl" />
                </div>
              </div>
            </div>

            <div className="bg-surface-900/90 rounded-3xl border border-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <div className="mb-4 flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-2xl" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-3 w-56" />
                </div>
              </div>

              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-[92%]" />
                <SkeletonBlock className="h-3 w-[78%]" />
                <SkeletonBlock className="h-3 w-[88%]" />
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-surface-900/90 rounded-3xl border border-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <div className="mb-5 flex flex-wrap gap-2">
                <SkeletonBlock className="h-7 w-20 rounded-full" />
                <SkeletonBlock className="h-7 w-24 rounded-full" />
                <SkeletonBlock className="h-7 w-16 rounded-full" />
                <SkeletonBlock className="h-7 w-18 rounded-full" />
              </div>

              <SkeletonBlock className="h-9 w-[78%]" />

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-4">
                  <SkeletonBlock className="h-12 w-12 rounded-2xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-36" />
                    <SkeletonBlock className="h-3 w-52" />
                  </div>
                  <SkeletonBlock className="h-10 w-16 rounded-xl" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <SkeletonBlock className="h-8 w-16 rounded-full" />
                <SkeletonBlock className="h-8 w-20 rounded-full" />
                <SkeletonBlock className="h-8 w-24 rounded-full" />
              </div>
            </div>

            <div className="bg-surface-900/90 rounded-3xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
              <div className="border-b border-white/10 px-5 py-4">
                <SkeletonBlock className="h-4 w-36" />
                <SkeletonBlock className="mt-2 h-3 w-52" />
              </div>

              <div className="space-y-4 p-5">
                <SkeletonBlock className="h-28 rounded-2xl" />
                <SkeletonBlock className="h-28 rounded-2xl" />
                <SkeletonBlock className="h-28 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
