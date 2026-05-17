'use client'

import { useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type Variant = 'up' | 'left' | 'right' | 'scale' | 'blur'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  variant?: Variant
  threshold?: number
  once?: boolean
}

function hiddenStyle(variant: Variant, distance: number) {
  switch (variant) {
    case 'left':
      return { opacity: 0, transform: `translate3d(${distance}px, 0, 0)` }
    case 'right':
      return { opacity: 0, transform: `translate3d(-${distance}px, 0, 0)` }
    case 'scale':
      return {
        opacity: 0,
        transform: `translate3d(0, ${distance / 2}px, 0) scale(0.96)`,
      }
    case 'blur':
      return {
        opacity: 0,
        transform: `translate3d(0, ${distance}px, 0)`,
        filter: 'blur(10px)',
      }
    case 'up':
    default:
      return { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` }
  }
}

export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 700,
  distance = 24,
  variant = 'up',
  threshold = 0.2,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  const pathname = usePathname()
  const prevPathname = useRef<string>(pathname)

  // Observer 연결 함수 (재사용)
  const connectObserver = useCallback(() => {
    const el = ref.current
    if (!el) return

    observerRef.current?.disconnect()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    observerRef.current = observer
    observer.observe(el)
  }, [once, threshold])

  // 초기 마운트
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    if (prefersReducedMotion) {
      setMounted(true)
      setVisible(true)
      return
    }

    timerRef.current = setTimeout(() => setMounted(true), 120)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      observerRef.current?.disconnect()
    }
  }, [])

  // mounted 되면 Observer 연결
  useEffect(() => {
    if (!mounted) return
    connectObserver()
    return () => observerRef.current?.disconnect()
  }, [mounted, connectObserver])

  // ✅ 핵심 수정: 경로 변화 감지 → visible 리셋 + Observer 재연결
  // 탐색 페이지에서 뒤로가기로 홈에 돌아올 때 pathname이 바뀌면서 트리거
  useEffect(() => {
    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    setVisible(false)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      connectObserver()
    }, 50)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [pathname, connectObserver])

  const hidden = hiddenStyle(variant, distance)
  const shouldShow = mounted && visible

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shouldShow ? 1 : hidden.opacity,
        transform: shouldShow
          ? 'translate3d(0,0,0) scale(1)'
          : hidden.transform,
        filter: shouldShow ? 'blur(0px)' : (hidden.filter ?? 'none'),
        transitionProperty: 'opacity, transform, filter',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  )
}
