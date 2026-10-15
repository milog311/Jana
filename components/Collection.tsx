'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  formatArea,
  formatBeds,
  formatPrice,
  type Property,
} from '@/content/properties'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { Locale } from '@/lib/locales'
import { trackBoth } from '@/lib/pixel'
import PropertyMedia, { posterFor } from './PropertyMedia'
import VideoPlayer from './VideoPlayer'
import { videoSrc } from '@/lib/video'
import Reveal from './Reveal'

type Props = {
  dict: Dictionary
  locale: Locale
  properties: Property[]
}

export default function Collection({ dict, locale, properties }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const open = openIndex === null ? null : properties[openIndex]

  const show = useCallback(
    (index: number) => {
      setOpenIndex(index)
      const property = properties[index]
      // ViewContent per residence — this is what tells you which film sells.
      trackBoth('ViewContent', {
        content_ids: [property.code],
        content_name: property.name,
        content_type: 'product',
        content_category: 'residence',
        value: property.price.amount,
        currency: property.price.currency,
      })
    },
    [properties],
  )

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current
        return (current + direction + properties.length) % properties.length
      })
    },
    [properties.length],
  )

  // Keyboard control and scroll lock while the player is open.
  useEffect(() => {
    if (openIndex === null) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [openIndex, close, step])

  return (
    <section id="collection" className="border-t border-line bg-paper-dim/60">
      <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-muted">{dict.collection.label}</p>
              <h2 className="display num mt-5 text-[8vw] sm:text-[3.5rem]">
                {dict.collection.heading}
              </h2>
            </div>
            <p className="text-sm text-muted">{dict.collection.sub}</p>
          </div>
        </Reveal>

        {/* Mobile: snap rail. Desktop: grid. */}
        <div className="no-bar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-12 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {properties.map((property, index) => (
            <Reveal
              key={property.code}
              delay={(index % 3) * 70}
              className="w-[78vw] shrink-0 snap-start sm:w-auto"
            >
              <PropertyCard
                property={property}
                dict={dict}
                locale={locale}
                priority={index < 3}
                onOpen={() => show(index)}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {open && (
        <Player
          property={open}
          dict={dict}
          locale={locale}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      )}
    </section>
  )
}

function Badge({
  status,
  dict,
}: {
  status: Property['status']
  dict: Dictionary
}) {
  if (status === 'available') return null

  const text =
    status === 'new'
      ? dict.collection.badge.new
      : status === 'reserved'
        ? dict.collection.badge.reserved
        : dict.collection.badge.sold

  const tone =
    status === 'sold'
      ? 'bg-ink text-paper'
      : status === 'reserved'
        ? 'bg-paper text-ink'
        : 'bg-brass text-ink'

  return (
    <span className={`label absolute left-3 top-3 z-10 rounded-full px-2.5 py-1.5 ${tone}`}>
      {text}
    </span>
  )
}

function PropertyCard({
  property,
  dict,
  locale,
  priority,
  onOpen,
}: {
  property: Property
  dict: Dictionary
  locale: Locale
  priority: boolean
  onOpen: () => void
}) {
  // Availability means a URL that actually resolves — a configured host plus
  // a video reference. The config object alone is not a playable film.
  const action = videoSrc(property) ? dict.collection.watch : dict.collection.soon

  return (
    <div className="group">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${action} — ${property.name}`}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-sm bg-ink text-left"
      >
        <Badge status={property.status} dict={dict} />

        {/* Grid cards stay typographic by design — the film's own imagery
            is held back until the viewer opens one. */}
        <PropertyMedia
          property={property}
          soonLabel={null}
          priority={priority}
          showPoster={false}
        />

        <span className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12">
          <span className="label text-paper/90">{action}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/35 text-paper transition-colors group-hover:border-paper group-hover:bg-paper group-hover:text-ink">
            <PlayIcon />
          </span>
        </span>
      </button>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
          <span className="num mr-2 font-mono text-[0.6875rem] text-muted">
            {property.code}
          </span>
          {property.name}
        </h3>
        <span className="num shrink-0 text-[0.9375rem]">
          {formatPrice(property.price.amount, property.price.currency, locale)}
        </span>
      </div>

      <p className="label num mt-3 text-muted/80">
        {property.neighbourhood[locale]} · {formatBeds(property.beds)}{' '}
        {dict.collection.spec.beds} · {formatArea(property.area)}
      </p>
    </div>
  )
}

function Player({
  property,
  dict,
  locale,
  onClose,
  onPrev,
  onNext,
}: {
  property: Property
  dict: Dictionary
  locale: Locale
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const src = videoSrc(property)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={property.name}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={dict.collection.close}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />

      <div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col gap-6 md:flex-row md:items-center">
        {/* A definite height is required: with only a max-height, the
            aspect ratio has nothing to resolve against and the panel
            collapses to zero width inside the flex row. */}
        <div className="relative mx-auto h-[52svh] w-auto max-w-full shrink-0 overflow-hidden rounded-sm bg-ink-soft [aspect-ratio:9/16] md:mx-0 md:h-[72svh]">
          {src ? (
            <VideoPlayer
              key={property.code}
              src={src}
              poster={posterFor(property)}
              className="h-full w-full object-cover"
            />
          ) : (
            <PropertyMedia
              property={property}
              soonLabel={dict.collection.soon}
              priority
            />
          )}
        </div>

        <div className="min-w-0 flex-1 text-paper">
          <p className="label num text-paper/45">{property.code}</p>
          <h3 className="display mt-3 text-4xl sm:text-5xl">
            {property.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-paper/70">
            {property.hook[locale]}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line-dark pt-6">
            {[
              [dict.collection.spec.price, formatPrice(property.price.amount, property.price.currency, locale)],
              [dict.collection.spec.location, property.neighbourhood[locale]],
              [dict.collection.spec.floor, property.floor[locale]],
              [dict.collection.spec.area, formatArea(property.area)],
              [dict.collection.spec.beds, formatBeds(property.beds)],
              [dict.collection.spec.baths, String(property.baths)],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="label text-paper/40">{term}</dt>
                <dd className="num mt-1.5 text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#enquire"
              onClick={onClose}
              className="label rounded-full bg-paper px-6 py-3.5 text-ink transition-opacity hover:opacity-85"
            >
              {dict.collection.enquire}
            </a>
            <div className="flex items-center gap-2">
              <PlayerNav label={dict.collection.prev} onClick={onPrev} glyph="←" />
              <PlayerNav label={dict.collection.next} onClick={onNext} glyph="→" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={dict.collection.close}
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper hover:text-ink sm:right-8 sm:top-8"
      >
        ✕
      </button>
    </div>
  )
}

function PlayerNav({
  label,
  onClick,
  glyph,
}: {
  label: string
  onClick: () => void
  glyph: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper hover:text-ink"
    >
      {glyph}
    </button>
  )
}

function PlayIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
      <path d="M11 6.5L0 13V0L11 6.5Z" fill="currentColor" />
    </svg>
  )
}
