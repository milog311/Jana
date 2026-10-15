import Link from 'next/link'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { Locale } from '@/lib/locales'
import Wordmark from './Wordmark'

export default function Footer({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: Locale
}) {
  return (
    <footer className="border-t border-line-dark bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark />
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-paper/55">
              {dict.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="label text-paper/40">{dict.footer.collection}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { href: '#collection', label: dict.nav.collection },
                { href: '#about', label: dict.nav.about },
                { href: '#process', label: dict.nav.process },
                { href: '#faq', label: dict.nav.faq },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-paper/70 transition-colors hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label text-paper/40">{dict.footer.contactLabel}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a href="mailto:hola@jana.example" className="text-paper/70 transition-colors hover:text-paper">
                  hola@jana.example
                </a>
              </li>
              <li>
                <a href="tel:+34600000000" className="num text-paper/70 transition-colors hover:text-paper">
                  +34 600 000 000
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label text-paper/40">{dict.footer.legalLabel}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href={`/${locale}/privacy`} className="text-paper/70 transition-colors hover:text-paper">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookies`} className="text-paper/70 transition-colors hover:text-paper">
                  {dict.footer.cookies}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line-dark pt-6">
          <p className="label num text-paper/35">
            ja/na 00.00 {new Date().getFullYear()}© - {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
