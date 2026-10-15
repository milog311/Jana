/**
 * Where a residence's film comes from.
 *
 * Two hosts are supported, because they work differently:
 *
 *   R2     — plain object storage. You upload an .mp4 and a .jpg poster and
 *            they are served as-is. Cheap and simple, but no transcoding, no
 *            adaptive bitrate and no generated thumbnails: every viewer gets
 *            the one file you uploaded, whatever their connection.
 *
 *   Stream — Cloudflare's video product. You upload once and it transcodes to
 *            HLS with multiple renditions and generates poster frames, so a
 *            viewer on bad mobile data gets a lower rendition instead of a
 *            stall. Costs more.
 *
 * Both are configured by environment variable, so switching host later is a
 * config change plus one field per property — no component changes.
 */

import type { Property } from '@/content/properties'

/** Public base URL of the R2 bucket, no trailing slash. */
const R2_BASE = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.replace(/\/+$/, '')

/** The `customer-xxxxxxxx` code from a Cloudflare Stream embed URL. */
const STREAM_CODE = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE

export type VideoSource =
  /** Served from R2. `file` defaults to `<slug>.mp4`. */
  | { kind: 'r2'; file?: string }
  /** Served from Cloudflare Stream, by video UID. */
  | { kind: 'stream'; streamId: string }

const streamRoot = (videoId: string): string | null =>
  STREAM_CODE
    ? `https://customer-${STREAM_CODE}.cloudflarestream.com/${videoId}`
    : null

/**
 * Playback URL — an .mp4 for R2, an HLS manifest for Stream.
 * Returns null when the host isn't configured, so cards fall back to the
 * placeholder rather than rendering a broken player.
 */
export function videoSrc(property: Property): string | null {
  const source = property.video
  if (!source) return null

  if (source.kind === 'r2') {
    if (!R2_BASE) return null
    return `${R2_BASE}/${source.file ?? `${property.slug}.mp4`}`
  }

  const root = streamRoot(source.streamId)
  return root ? `${root}/manifest/video.m3u8` : null
}

/**
 * Poster frame. An explicit `poster` on the property always wins.
 * R2 has no thumbnail generation, so it falls back to the film's own name
 * with a .jpg extension — upload one beside each video. Stream generates
 * its own.
 */
export function videoPoster(property: Property): string | undefined {
  if (property.poster) return property.poster

  const source = property.video
  if (!source) return undefined

  if (source.kind === 'r2') {
    if (!R2_BASE) return undefined
    // Derived from the film's own filename, so two properties sharing one
    // film also share its poster instead of asking for a slug that isn't there.
    const file = source.file ?? `${property.slug}.mp4`
    return `${R2_BASE}/${file.replace(/\.[^.]+$/, '.jpg')}`
  }

  const root = streamRoot(source.streamId)
  return root
    ? `${root}/thumbnails/thumbnail.jpg?time=1s&height=1200`
    : undefined
}

/** True when the URL needs hls.js rather than plain <video src>. */
export const isHls = (src: string): boolean => src.includes('.m3u8')
