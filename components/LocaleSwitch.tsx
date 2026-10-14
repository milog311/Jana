'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { locales, otherLocale, type Locale } from '@/lib/locales'

/** Swaps the locale segment while keeping the visitor on the same page. */
export default function LocaleSwitch({
  locale,
  label,
  className = '',
}: {
  locale: Locale
  label: string
  className?: string
}) {
  const pathname = usePathname() || `/${locale}`
  const target = otherLocale(locale)

  const segments = pathname.split('/')
  // segments[0] is the empty string before the leading slash.
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = target
  } else {
    segments.splice(1, 0, target)
  }

  return (
    <Link
      href={segments.join('/') || `/${target}`}
      hrefLang={target}
      aria-label={`${label}: ${target.toUpperCase()}`}
      className={`label text-muted transition-colors hover:text-ink ${className}`}
    >
      {target.toUpperCase()}
    </Link>
  )
}
