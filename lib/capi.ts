import 'server-only'
import { hashEmail, hashName, hashPhone } from './hash'

/**
 * Graph API version. Meta deprecates a version roughly two years after
 * release, so this is env-overridable — bump FB_GRAPH_VERSION rather than
 * editing code when Events Manager warns about the version.
 */
const GRAPH_VERSION = process.env.FB_GRAPH_VERSION || 'v23.0'

export type CapiEventName = 'PageView' | 'ViewContent' | 'Lead' | 'Contact'

export type CapiInput = {
  eventName: CapiEventName
  /** Must match the browser pixel's eventID exactly, or the event double-counts. */
  eventId: string
  eventSourceUrl: string
  /** Seconds since epoch. Meta rejects events older than 7 days. */
  eventTime?: number
  actionSource?: 'website'
  user: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    ip?: string
    userAgent?: string
    /** _fbp cookie — the single highest-value match signal after email. */
    fbp?: string
    /** _fbc cookie, or built from the fbclid query param on landing. */
    fbc?: string
  }
  custom?: Record<string, unknown>
}

export type CapiResult =
  | { ok: true; eventsReceived?: number }
  | { ok: false; error: string; skipped?: boolean }

/**
 * Sends one event to the Conversions API.
 *
 * Returns a result rather than throwing: a tracking failure must never take
 * down a lead submission. Callers log and carry on.
 */
export async function sendCapiEvent(input: CapiInput): Promise<CapiResult> {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID
  const accessToken = process.env.FB_CAPI_ACCESS_TOKEN

  if (!pixelId || !accessToken) {
    return { ok: false, error: 'capi-not-configured', skipped: true }
  }

  const userData: Record<string, string | string[]> = {}
  const em = input.user.email ? hashEmail(input.user.email) : undefined
  const ph = input.user.phone ? hashPhone(input.user.phone) : undefined
  const fn = input.user.firstName ? hashName(input.user.firstName) : undefined
  const ln = input.user.lastName ? hashName(input.user.lastName) : undefined

  if (em) userData.em = [em]
  if (ph) userData.ph = [ph]
  if (fn) userData.fn = [fn]
  if (ln) userData.ln = [ln]
  if (input.user.ip) userData.client_ip_address = input.user.ip
  if (input.user.userAgent) userData.client_user_agent = input.user.userAgent
  if (input.user.fbp) userData.fbp = input.user.fbp
  if (input.user.fbc) userData.fbc = input.user.fbc

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: input.actionSource ?? 'website',
        user_data: userData,
        ...(input.custom ? { custom_data: input.custom } : {}),
      },
    ],
  }

  if (process.env.FB_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.FB_TEST_EVENT_CODE
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      },
    )

    const body = (await response.json().catch(() => null)) as
      | { events_received?: number; error?: { message?: string } }
      | null

    if (!response.ok) {
      return {
        ok: false,
        error: body?.error?.message ?? `capi-http-${response.status}`,
      }
    }

    return { ok: true, eventsReceived: body?.events_received }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'capi-network-error',
    }
  }
}

/** Splits a single free-text name field into the two fields Meta wants. */
export function splitName(full: string): {
  firstName?: string
  lastName?: string
} {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return {}
  if (parts.length === 1) return { firstName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

/** Meta's documented fbc format when only the raw click id is available. */
export function buildFbc(fbclid?: string): string | undefined {
  if (!fbclid) return undefined
  return `fb.1.${Date.now()}.${fbclid}`
}
