'use client'

import { useEffect, useState } from 'react'
import type { Locale } from '@/lib/locales'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import LocaleSwitch from './LocaleSwitch'
import Wordmark from './Wordmark'

export default function Header({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: Locale
}) {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#collection', label: dict.nav.collection },
    { href: '#about', label: dict.nav.about },
    { href: '#process', label: dict.nav.process },
    { href: '#faq', label: dict.nav.faq },
  ]

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        solid
          ? 'border-b border-line bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      {/*
        Flex below md, grid from md. The nav is display:none on mobile, so it
        leaves the grid entirely and the three columns collapse to two - which
        dropped the wordmark into column one and stranded the language switch
        in the middle. Flex with justify-between puts the wordmark left and the
        language switch hard right.
      */}
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-6 sm:px-8 md:grid md:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden md:flex md:items-center md:gap-7" aria-label={dict.nav.collection}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="label text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="md:justify-self-center" aria-label="Jana">
          <Wordmark />
        </a>

        <div className="flex items-center justify-end gap-4 sm:gap-5">
          <LocaleSwitch locale={locale} label={dict.locale.label} />
          <a
            href="#enquire"
            className="label hidden rounded-full bg-ink px-4 py-2.5 text-paper transition-opacity hover:opacity-85 sm:inline-block"
          >
            {dict.nav.cta}
          </a>
        </div>
      </div>
    </header>
  )
}
