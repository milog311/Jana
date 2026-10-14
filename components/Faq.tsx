import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/**
 * Accordion built on native <details>, so it works with zero JavaScript and
 * is keyboard- and screen-reader-correct for free.
 */
export default function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section id="faq" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-4">
            <p className="label text-muted">{dict.faq.label}</p>
            <h2 className="display mt-5 text-[8vw] sm:text-[3rem]">
              {dict.faq.heading}
            </h2>
          </Reveal>

          <div className="md:col-span-8">
            {dict.faq.items.map((item, index) => (
              <Reveal key={item.q} delay={index * 40}>
                <details className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-[0.9375rem] font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="mt-0.5 shrink-0 text-muted transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-7 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
