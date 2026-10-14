import type { Property } from '@/content/properties'

/**
 * A residence's visual.
 *
 * With no film or poster uploaded yet it renders a typographic placeholder in
 * the property's tone — deliberately designed rather than a grey box, so the
 * page reads finished while you shoot. Drop in `poster` / `video` and this
 * swaps over with no other changes.
 */
export default function PropertyMedia({
  property,
  locale,
  soonLabel,
  priority = false,
}: {
  property: Property
  locale: 'en' | 'es'
  soonLabel: string
  priority?: boolean
}) {
  if (property.poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={property.poster}
        alt={property.name[locale]}
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

      <span className="label text-white/35">{soonLabel}</span>
    </div>
  )
}
