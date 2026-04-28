import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-surface-700/50 border-t py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="from-brand-400 to-brand-600 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">PROMPTER</span>
          </div>
          <p className="text-surface-500 text-sm">© 2026 Prompter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
