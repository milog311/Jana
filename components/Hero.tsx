import type { Dictionary } from '@/app/[lang]/dictionaries'

/**
 * Full-bleed hero.
 *
 * Built to carry a muted, looping background film. Until one exists it holds
 * a dark typographic composition — when you have the hero cut, pass
 * `videoSrc` and it layers in behind the type with no layout change.
 */
export default function Hero({
  dict,
  videoSrc,
  poster,
}: {
  dict: Dictionary
  videoSrc?: string
  poster?: string
}) {
  const lines = dict.hero.title.split('\n')

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink text-paper"
    >
      {videoSrc ? (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              'radial-gradient(130% 90% at 18% 0%, rgba(168,129,76,0.22), transparent 55%), radial-gradient(100% 80% at 90% 100%, rgba(255,255,255,0.07), transparent 60%)',
          }}
          aria-hidden="true"
        />
      )}

      <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <p className="label text-paper/50">{dict.hero.eyebrow}</p>

        <h1 className="display mt-7 max-w-[20ch] text-[13vw] sm:text-[8vw] lg:text-[5.75rem]">
          {lines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper/65 sm:text-base">
          {dict.hero.tagline}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="#enquire"
            className="label rounded-full bg-paper px-7 py-4 text-center text-ink transition-opacity hover:opacity-85"
          >
            {dict.hero.cta}
          </a>
          <a
            href="#collection"
            className="label rounded-full border border-paper/25 px-7 py-4 text-center text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
          >
            {dict.hero.secondary}
          </a>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1400px] px-8 pb-8 sm:block">
        <span className="label text-paper/30">{dict.hero.scroll} ↓</span>
      </div>
    </section>
  )
}
