'use client'

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

// ── 타입 ──────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (opts: Omit<Toast, 'id'>) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  dismiss: (id: string) => void
}

// ── Context ───────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// ── 아이콘 + 스타일 매핑 ──────────────────────────────
const TOAST_CONFIG: Record<
  ToastType,
  {
    icon: React.ElementType
    iconClass: string
    borderClass: string
    bgClass: string
    barClass: string
  }
> = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10',
    barClass: 'bg-emerald-500',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-red-400',
    borderClass: 'border-red-500/30',
    bgClass: 'bg-red-500/10',
    barClass: 'bg-red-500',
  },
  warning: {
    icon: AlertCircle,
    iconClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
    barClass: 'bg-amber-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-400',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/10',
    barClass: 'bg-blue-500',
  },
}

// ── 개별 Toast 아이템 ─────────────────────────────────
function ToastItem({
  toast,
  onDismiss,
}: Readonly<{
  toast: Toast
  onDismiss: (id: string) => void
}>) {
  const config = TOAST_CONFIG[toast.type]
  const Icon = config.icon
  const duration = toast.duration ?? 4000
  const [exiting, setExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }, [toast.id, onDismiss])

  useEffect(() => {
    const timer = setTimeout(handleDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, handleDismiss])

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm overflow-hidden rounded-2xl border backdrop-blur-xl',
        'bg-surface-800/95 shadow-2xl',
        config.borderClass,
        exiting
          ? 'translate-x-full opacity-0 transition-all duration-300'
          : 'translate-x-0 opacity-100 transition-all duration-300'
      )}
    >
      {/* 왼쪽 컬러 바 */}
      <div className={cn('w-1 shrink-0', config.barClass)} />

      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        {/* 아이콘 */}
        <div className={cn('mt-0.5 shrink-0 rounded-lg p-1.5', config.bgClass)}>
          <Icon className={cn('h-4 w-4', config.iconClass)} />
        </div>

        {/* 텍스트 */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.message && (
            <p className="text-surface-400 mt-0.5 text-xs leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={handleDismiss}
          className="text-surface-500 hover:text-surface-200 mt-0.5 -mr-1 shrink-0 rounded-lg p-1 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 프로그레스 바 */}
      <div
        className={cn(
          'absolute right-0 bottom-0 left-1 h-0.5 origin-left',
          config.barClass,
          'opacity-40'
        )}
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />

      <style jsx>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  )
}

// ── Toast 컨테이너 ─────────────────────────────────────
function ToastContainer({
  toasts,
  onDismiss,
}: Readonly<{
  toasts: Toast[]
  onDismiss: (id: string) => void
}>) {
  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-6 z-9999 flex flex-col items-end gap-2 sm:right-6">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}

// ── Provider ───────────────────────────────────────────
export function ToastProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counterRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${++counterRef.current}`
    setToasts((prev) => [...prev.slice(-4), { ...opts, id }]) // 최대 5개
  }, [])

  const success = useCallback(
    (title: string, message?: string) =>
      toast({ type: 'success', title, message }),
    [toast]
  )
  const error = useCallback(
    (title: string, message?: string) =>
      toast({ type: 'error', title, message }),
    [toast]
  )
  const warning = useCallback(
    (title: string, message?: string) =>
      toast({ type: 'warning', title, message }),
    [toast]
  )
  const info = useCallback(
    (title: string, message?: string) =>
      toast({ type: 'info', title, message }),
    [toast]
  )

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, error, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
