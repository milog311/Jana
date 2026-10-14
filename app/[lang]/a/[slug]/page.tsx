import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { isLocale, locales } from '@/lib/locales'
import { advertorials, findAdvertorial } from '@/content/advertorials'
import { properties } from '@/content/properties'
import { getDictionary } from '../../dictionaries'
import AdvertorialBody from '@/components/AdvertorialBody'
import LeadForm from '@/components/LeadForm'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StickyCta from '@/components/StickyCta'

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    advertorials.map((item) => ({ lang, slug: item.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const article = findAdvertorial(slug)
  if (!isLocale(lang) || !article) return {}

  const copy = article[lang]
  return {
    title: copy.title,
    description: copy.standfirst,
    alternates: {
      canonical: `/${lang}/a/${slug}`,
      languages: { en: `/en/a/${slug}`, es: `/es/a/${slug}` },
    },
  }
}

export default async function AdvertorialPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const article = findAdvertorial(slug)
  if (!article) notFound()

  const dict = await getDictionary(lang)
  const copy = article[lang]

  return (
    <>
      <Header dict={dict} locale={lang} />

      <main>
        <article className="mx-auto max-w-[720px] px-5 py-16 sm:py-24">
          {/* Required disclosure — advertising dressed as editorial must say so. */}
          <p className="label inline-block rounded-full border border-line px-3 py-1.5 text-muted">
            {dict.advertorial.disclosure}
          </p>

          <h1 className="display mt-8 text-[9vw] sm:text-[3.5rem]">
            {copy.title}
          </h1>

          <p className="mt-7 text-[1.1875rem] leading-relaxed text-muted">
            {copy.standfirst}
          </p>

          <p className="label mt-8 border-t border-line pt-6 text-muted">
            {dict.advertorial.by} {article.byline} · {article.readingTime}{' '}
            {dict.advertorial.readingTime}
          </p>

          <div className="mt-12">
            <AdvertorialBody blocks={copy.blocks} dict={dict} locale={lang} />
          </div>

          <div className="mt-16 border-t border-line pt-8">
            <Link href={`/${lang}`} className="label text-muted hover:text-ink">
              ← {dict.advertorial.backToCollection}
            </Link>
          </div>
        </article>

        <LeadForm dict={dict} locale={lang} properties={properties} />
      </main>

      <Footer dict={dict} locale={lang} />
      <StickyCta label={dict.sticky.cta} />
    </>
  )
}
