import Link from 'next/link'
import type { Locale } from '@/lib/locales'
import Wordmark from './Wordmark'

export type LegalSection = { heading: string; body: string[] }

/** Shared shell for the privacy and cookie pages. */
export default function LegalPage({
  locale,
  title,
  updated,
  sections,
  backLabel,
}: {
  locale: Locale
  title: string
  updated: string
  sections: LegalSection[]
  backLabel: string
}) {
  return (
    <div className="min-h-svh">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-[800px] items-center justify-between px-5">
          <Link href={`/${locale}`} aria-label="Jana">
            <Wordmark />
          </Link>
          <Link href={`/${locale}`} className="label text-muted hover:text-ink">
            {backLabel}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-20">
        <h1 className="display text-[10vw] sm:text-[3.5rem]">{title}</h1>
        <p className="label mt-6 text-muted">{updated}</p>

        <div className="mt-16 space-y-12">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-medium tracking-[-0.015em]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
