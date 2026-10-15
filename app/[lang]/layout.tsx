import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { locales, isLocale } from '@/lib/locales'
import { getDictionary } from './dictionaries'
import ConsentBanner from '@/components/ConsentBanner'
import PixelLoader from '@/components/PixelLoader'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-face',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}

  const dict = await getDictionary(lang)

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', es: '/es' },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: lang === 'es' ? 'es_ES' : 'en_GB',
      type: 'website',
      url: `/${lang}`,
    },
    robots: { index: true, follow: true },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <html lang={lang} className={`${inter.variable} ${mono.variable}`}>
      <body>
        {/*
          Marks the document as script-capable before the rest of <body> is
          parsed, which is what arms the scroll-reveal animation. Without it
          every section simply renders visible — the page must never depend
          on JS to show its content.

          This deliberately does NOT live in a manual <head>: the App Router
          injects the stylesheet link there itself, and rendering our own
          <head> suppresses it, shipping the page completely unstyled.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
        <ConsentBanner dict={dict} locale={lang} />
        <PixelLoader />
      </body>
    </html>
  )
}
