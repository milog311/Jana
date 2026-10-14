'use client'

import { useEffect, useState } from 'react'

/** Mobile-only CTA bar. Appears past the hero, hides over the form itself. */
export default function StickyCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const form = document.getElementById('enquire')

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85
      const formInView = form
        ? form.getBoundingClientRect().top < window.innerHeight
        : false
      setVisible(pastHero && !formInView)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line-dark bg-ink/95 p-3 backdrop-blur-md transition-transform duration-300 sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <a
        href="#enquire"
        tabIndex={visible ? 0 : -1}
        className="label block rounded-full bg-paper py-3.5 text-center text-ink"
      >
        {label}
      </a>
    </div>
  )
}
