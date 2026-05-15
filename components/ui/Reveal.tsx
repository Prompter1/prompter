'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

    if (prefersReducedMotion) {
      setVisible(true)
      return
    }

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

    observer.observe(el)
    return () => observer.disconnect()
  }, [once, threshold])

  const hidden = hiddenStyle(variant, distance)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : hidden.opacity,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : hidden.transform,
        filter: visible ? 'blur(0px)' : (hidden.filter ?? 'none'),
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
