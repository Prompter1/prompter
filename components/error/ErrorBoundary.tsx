'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  /** 에러 발생 시 보여줄 커스텀 폴백 UI */
  fallback?: ReactNode
  /** 에러 섹션 이름 (로그용) */
  section?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * 전역/섹션 Error Boundary
 *
 * 사용 예시:
 *   <ErrorBoundary section="FeaturedPrompts">
 *     <FeaturedPromptsSection />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 프로덕션에서는 Sentry 등 외부 리포팅 서비스로 전송
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `[ErrorBoundary${this.props.section ? `:${this.props.section}` : ''}]`,
        error,
        info.componentStack
      )
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <p className="font-semibold text-white">
            {this.props.section
              ? `${this.props.section} 섹션을 불러오지 못했습니다`
              : '문제가 발생했습니다'}
          </p>
          <p className="text-surface-400 mt-1 text-sm">
            일시적인 오류입니다. 새로고침하거나 잠시 후 다시 시도하세요.
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre className="text-surface-500 mt-2 max-w-md overflow-auto rounded-lg bg-black/30 p-2 text-left text-xs">
              {this.state.error.message}
            </pre>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>
          <a
            href="/"
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <Home className="h-4 w-4" />
            홈으로
          </a>
        </div>
      </div>
    )
  }
}

/** 페이지 전체를 덮는 풀스크린 에러 폴백 */
export function FullPageError({ reset }: Readonly<{ reset?: () => void }>) {
  return (
    <div className="bg-surface-900 flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">
          예상치 못한 오류가 발생했습니다
        </h1>
        <p className="text-surface-400 mt-2 text-sm">
          불편을 드려 죄송합니다. 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <div className="flex gap-3">
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </button>
        )}
        <a
          href="/"
          className="from-brand-500 to-brand-600 flex items-center gap-2 rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Home className="h-4 w-4" />
          홈으로
        </a>
      </div>
    </div>
  )
}
