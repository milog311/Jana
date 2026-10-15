import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/**
 * The personal brand block.
 *
 * `portrait` is intentionally optional — until a photograph exists the panel
 * holds a typographic composition instead of an empty frame.
 */
export default function Agent({
  dict,
  portrait,
}: {
  dict: Dictionary
  portrait?: string
}) {
  return (
    <section id="about" className="bg-ink text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-soft">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={portrait}
                  alt="Jana"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-end p-6"
                  style={{
                    backgroundImage:
                      'radial-gradient(110% 80% at 30% 10%, rgba(168,129,76,0.26), transparent 58%)',
                  }}
                  aria-hidden="true"
                >
                  <span className="display text-[20vw] leading-none text-paper/[0.08] sm:text-[7rem]">
                    ja/na
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={120} className="md:col-span-6 md:col-start-7 md:self-center">
            <p className="label text-paper/45">{dict.agent.label}</p>
            <h2 className="display mt-5 text-[8vw] sm:text-[3.25rem]">
              {dict.agent.heading}
            </h2>
            <div className="mt-7 space-y-5">
              {dict.agent.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-paper/70"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <a
              href="#enquire"
              className="label mt-9 inline-block rounded-full border border-paper/25 px-7 py-4 text-paper/85 transition-colors hover:border-paper hover:text-paper"
            >
              {dict.agent.cta}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
