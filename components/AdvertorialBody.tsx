'use client'

import { useState } from 'react'
import { properties, formatPrice } from '@/content/properties'
import { videoSrc } from '@/lib/video'
import type { Block } from '@/content/advertorials'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { Locale } from '@/lib/locales'
import { trackBoth } from '@/lib/pixel'
import PropertyMedia, { posterFor } from './PropertyMedia'
import VideoPlayer from './VideoPlayer'

/** Renders advertorial blocks, including inline residence films. */
export default function AdvertorialBody({
  blocks,
  dict,
  locale,
}: {
  blocks: Block[]
  dict: Dictionary
  locale: Locale
}) {
  return (
    <div className="space-y-7">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={index} className="text-[1.0625rem] leading-[1.75]">
                {block.text}
              </p>
            )

          case 'h':
            return (
              <h2
                key={index}
                className="display pt-6 text-[1.75rem] sm:text-[2rem]"
              >
                {block.text}
              </h2>
            )

          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-2 border-brass pl-6 text-[1.1875rem] leading-relaxed"
              >
                “{block.text}”
                {block.attribution && (
                  <footer className="label mt-4 text-muted">
                    {block.attribution}
                  </footer>
                )}
              </blockquote>
            )

          case 'list':
            return (
              <ul key={index} className="space-y-3 pl-1">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[1.0625rem] leading-[1.7]">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                    {item}
                  </li>
                ))}
              </ul>
            )

          case 'reel':
            return (
              <InlineReel
                key={index}
                code={block.code}
                caption={block.caption}
                dict={dict}
                locale={locale}
              />
            )

          case 'cta':
            return (
              <div key={index} className="py-4">
                <a
                  href="#enquire"
                  className="label inline-block rounded-full bg-ink px-7 py-4 text-paper transition-opacity hover:opacity-85"
                >
                  {block.label}
                </a>
              </div>
            )
        }
      })}
    </div>
  )
}

function InlineReel({
  code,
  caption,
  dict,
  locale,
}: {
  code: string
  caption?: string
  dict: Dictionary
  locale: Locale
}) {
  const property = properties.find((item) => item.code === code)
  const [playing, setPlaying] = useState(false)

  if (!property) return null

  const src = videoSrc(property)

  function start() {
    setPlaying(true)
    trackBoth('ViewContent', {
      content_ids: [property!.code],
      content_name: property!.name,
      content_type: 'product',
      content_category: 'residence-advertorial',
      value: property!.price.amount,
      currency: property!.price.currency,
    })
  }

  return (
    <figure className="my-12 -mx-5 sm:mx-0">
      <div className="relative mx-auto aspect-[9/16] max-w-sm overflow-hidden rounded-sm bg-ink">
        {playing && src ? (
          <VideoPlayer
            src={src}
            poster={posterFor(property)}
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={start}
            className="group absolute inset-0 h-full w-full"
            aria-label={`${dict.collection.watch} - ${property.name}`}
          >
            <PropertyMedia property={property} soonLabel={null} />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12">
              <span className="label text-paper/90">{property.name}</span>
              <span className="num label text-paper/70">
                {formatPrice(property.price.amount, property.price.currency, locale)}
              </span>
            </span>
          </button>
        )}
      </div>

      {caption && (
        <figcaption className="mx-auto mt-4 max-w-sm px-6 text-sm leading-relaxed text-muted sm:px-0">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
