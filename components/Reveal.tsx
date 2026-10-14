'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Fades a block in the first time it enters the viewport.
 *
 * Deliberately stateless: the effect writes the `data-shown` attribute
 * straight to the DOM and CSS does the animation (see `.reveal` in
 * globals.css). No React state means no re-render per section, and no
 * animation library in the bundle.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const show = () => {
      node.dataset.shown = 'true'
    }

    // Without IntersectionObserver, show everything rather than nothing.
    if (!('IntersectionObserver' in window)) {
      show()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-shown="false"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
