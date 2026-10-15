import type { Property } from '@/content/properties'
import { streamPoster } from '@/lib/stream'

/** Poster for a residence: explicit override, else the Stream thumbnail. */
export function posterFor(property: Property): string | undefined {
  if (property.poster) return property.poster
  if (property.video) return streamPoster(property.video.streamId) ?? undefined
  return undefined
}

/**
 * A residence's still image.
 *
 * With no film uploaded and no poster set it renders a typographic
 * placeholder in the property's tone — deliberately designed rather than a
 * grey box, so the page reads finished while the films are in production.
 */
export default function PropertyMedia({
  property,
  soonLabel,
  priority = false,
}: {
  property: Property
  /** Pass null where the surrounding UI already states the film's status. */
  soonLabel?: string | null
  priority?: boolean
}) {
  const poster = posterFor(property)

  if (poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt={property.name}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between overflow-hidden p-5"
      style={{
        backgroundColor: property.tone,
        backgroundImage:
          'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.09), transparent 60%)',
      }}
      aria-hidden="true"
    >
      <span className="label text-white/45">{property.code}</span>

      <span className="num block font-mono text-[22vw] leading-none tracking-tighter text-white/[0.07] sm:text-[9rem]">
        {property.code.replace('.', '')}
      </span>

      {soonLabel ? (
        <span className="label text-white/35">{soonLabel}</span>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  )
}
