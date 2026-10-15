import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/** Removes the last objections immediately before the form. */
export default function RiskReversal({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-24 sm:px-8 sm:pt-32">
      <Reveal>
        <h2 className="display text-[7vw] sm:text-[2.5rem]">{dict.risk.heading}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {dict.risk.items.map((item) => (
            <div key={item.title} className="rule pt-5">
              <h3 className="text-base font-medium tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-2.5 max-w-[38ch] text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
