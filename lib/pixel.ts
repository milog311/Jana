'use client'

/**
 * Meta Pixel, loaded only after explicit consent.
 *
 * Every conversion fires twice on purpose: once in the browser (fast, carries
 * the browser's own cookies) and once server-side through the Conversions API
 * (survives ad blockers and Safari). They share an `eventId`, which is how
 * Meta deduplicates them into a single conversion. Omit it and every lead
 * counts twice.
 */

type Fbq = {
  (...args: unknown[]): void
  queue?: unknown[]
  callMethod?: (...args: unknown[]) => void
  loaded?: boolean
  version?: string
  push?: unknown
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID
const SCRIPT_ID = 'meta-pixel'

export const newEventId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

/** Injects fbevents.js once. Safe to call repeatedly. */
export function loadPixel(): void {
  if (!PIXEL_ID || typeof window === 'undefined') return
  if (document.getElementById(SCRIPT_ID)) return

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const bootstrap = function (this: any) {
    const fbq: Fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args)
      } else {
        fbq.queue?.push(args)
      }
    } as Fbq
    fbq.queue = []
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.push = fbq
    if (!window._fbq) window._fbq = fbq
    window.fbq = fbq
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  if (!window.fbq) bootstrap()

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  window.fbq?.('init', PIXEL_ID)
}

export function trackPixel(
  eventName: string,
  eventId: string,
  custom?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', eventName, custom ?? {}, { eventID: eventId })
}

/** Reads the click id Meta appends to the ad's destination URL. */
export function readFbclid(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const value = new URLSearchParams(window.location.search).get('fbclid')
  return value ?? undefined
}

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

/**
 * Mirrors a browser event to the Conversions API so it survives ad blockers.
 * Fire-and-forget: a tracking failure must never interrupt the visitor.
 */
export async function mirrorToCapi(body: {
  eventName: string
  eventId: string
  custom?: Record<string, unknown>
}): Promise<void> {
  try {
    await fetch('/api/capi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ...body,
        fbp: readCookie('_fbp'),
        fbc: readCookie('_fbc'),
        fbclid: readFbclid(),
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    })
  } catch {
    // Attribution is best-effort by design.
  }
}

/** Browser + server in one call, sharing an id so Meta counts one conversion. */
export function trackBoth(
  eventName: string,
  custom?: Record<string, unknown>,
): string {
  const eventId = newEventId()
  trackPixel(eventName, eventId, custom)
  void mirrorToCapi({ eventName, eventId, custom })
  return eventId
}
