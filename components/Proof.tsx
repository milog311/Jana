import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/** The reference's handle-credited UGC grid, trimmed to six and made legible. */
export default function Proof({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-line bg-paper-dim/60">
      <div className="mx-auto max-w-[1400px] px-6 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="label text-muted">{dict.proof.label}</p>
          <h2 className="display mt-5 text-[8vw] lowercase sm:text-[3.25rem]">
            {dict.proof.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.proof.items.map((item, index) => (
            <Reveal key={item.name} delay={(index % 3) * 80}>
              <figure className="flex h-full flex-col justify-between rounded-sm border border-line bg-paper p-6">
                <blockquote className="text-[0.9375rem] leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-7 flex items-baseline justify-between gap-3 border-t border-line pt-4">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="label text-muted">{item.meta}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
