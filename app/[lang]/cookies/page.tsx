import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/locales'
import { legal } from '@/content/legal'
import { getDictionary } from '../dictionaries'
import LegalPage from '@/components/LegalPage'

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const doc = legal[lang].cookies

  return (
    <LegalPage
      locale={lang}
      title={doc.title}
      updated={doc.updated}
      sections={doc.sections}
      backLabel={dict.advertorial.backToCollection}
    />
  )
}
