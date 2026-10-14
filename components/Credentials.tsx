import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

/** The reference's numbered claims band, carrying real figures. */
export default function Credentials({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="label text-muted">{dict.credentials.label}</p>
          <h2 className="display mt-5 max-w-[26ch] text-[7vw] sm:text-[3rem]">
            {dict.credentials.heading}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {dict.credentials.items.map((item, index) => (
            <Reveal key={item.n} delay={index * 90}>
              <div className="rule pt-6">
                <span className="label num text-brass">{item.n}</span>
                <h3 className="display num mt-6 text-[2rem] sm:text-[2.25rem]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
