/**
 * Cloudflare Stream URL helpers.
 *
 * Every URL is derived from the video UID plus the account's customer code,
 * so publishing a film is a one-field change in content/properties.ts.
 *
 * Set NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE to the code in your Stream embed
 * URLs — the `customer-xxxxxxxx` part of
 * `https://customer-xxxxxxxx.cloudflarestream.com/<uid>/iframe`.
 *
 * These helpers assume videos whose signed-URL requirement is OFF. If you
 * turn signing on, the manifest needs a short-lived token minted server-side
 * and these URLs stop working on their own.
 */

const CUSTOMER_CODE = process.env.NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE

const base = (videoId: string): string | null =>
  CUSTOMER_CODE
    ? `https://customer-${CUSTOMER_CODE}.cloudflarestream.com/${videoId}`
    : null

/** HLS manifest. Safari plays this natively; elsewhere hls.js handles it. */
export const streamHls = (videoId: string): string | null => {
  const root = base(videoId)
  return root ? `${root}/manifest/video.m3u8` : null
}

/**
 * Poster frame. `time` is where in the film to grab it from — the first
 * frame of a walk-through is often a doorway, so default a little in.
 */
export const streamPoster = (
  videoId: string,
  { height = 1200, time = '1s' }: { height?: number; time?: string } = {},
): string | null => {
  const root = base(videoId)
  return root ? `${root}/thumbnails/thumbnail.jpg?time=${time}&height=${height}` : null
}

/** True once the account code is configured, so callers can fall back. */
export const streamConfigured = (): boolean => Boolean(CUSTOMER_CODE)
