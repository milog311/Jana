import type { Dictionary } from '@/app/[lang]/dictionaries'
import Reveal from './Reveal'

export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section id="process" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <p className="label text-muted">{dict.process.label}</p>
        <h2 className="display mt-5 text-[8vw] sm:text-[3.25rem]">
          {dict.process.heading}
        </h2>
      </Reveal>

      <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {dict.process.steps.map((step, index) => (
          <Reveal key={step.n} delay={index * 90}>
            <li className="rule pt-6">
              <span className="label num text-brass">{step.n}</span>
              <h3 className="mt-5 text-xl font-medium tracking-[-0.015em]">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
