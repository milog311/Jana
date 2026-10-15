import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/** The reference's "Expressions of beauty." statement block. */
export default function Positioning({ dict }: { dict: Dictionary }) {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <h2 className="display text-[9vw] sm:text-[4.5rem] md:col-span-7 md:text-[4rem] lg:text-[4.5rem]">
            {dict.positioning.heading}
          </h2>
          <p className="max-w-[44ch] self-end text-[0.9375rem] leading-relaxed text-muted md:col-span-5 md:col-start-8">
            {dict.positioning.body}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
