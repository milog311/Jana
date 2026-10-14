import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/locales'
import { properties } from '@/content/properties'
import { getDictionary } from './dictionaries'
import Ticker from '@/components/Ticker'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Positioning from '@/components/Positioning'
import Collection from '@/components/Collection'
import Credentials from '@/components/Credentials'
import Agent from '@/components/Agent'
import Process from '@/components/Process'
import Proof from '@/components/Proof'
import RiskReversal from '@/components/RiskReversal'
import LeadForm from '@/components/LeadForm'
import Faq from '@/components/Faq'
import Footer from '@/components/Footer'
import StickyCta from '@/components/StickyCta'

export default async function LanderPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <>
      <Ticker items={dict.ticker} />
      <Header dict={dict} locale={lang} />

      <main>
        <Hero dict={dict} />
        <Positioning dict={dict} />
        <Collection dict={dict} locale={lang} properties={properties} />
        <Credentials dict={dict} />
        <Agent dict={dict} />
        <Process dict={dict} />
        <Proof dict={dict} />
        <RiskReversal dict={dict} />
        <LeadForm dict={dict} locale={lang} properties={properties} />
        <Faq dict={dict} />
      </main>

      <Footer dict={dict} locale={lang} />
      <StickyCta label={dict.sticky.cta} />
    </>
  )
}
