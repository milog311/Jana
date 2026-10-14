import { headers } from 'next/headers'
import { buildFbc, sendCapiEvent, type CapiEventName } from '@/lib/capi'

const ALLOWED: CapiEventName[] = ['PageView', 'ViewContent', 'Lead', 'Contact']

/**
 * Mirrors a browser pixel event server-side.
 *
 * This endpoint deliberately accepts no personal data — the browser has none
 * to give at this point. PII only ever reaches Meta through /api/lead, where
 * the visitor has typed it and ticked a consent box.
 */
export async function POST(request: Request) {
  let body: {
    eventName?: string
    eventId?: string
    eventSourceUrl?: string
    custom?: Record<string, unknown>
    fbp?: string
    fbc?: string
    fbclid?: string
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad-json' }, { status: 400 })
  }

  const { eventName, eventId } = body

  if (!eventName || !ALLOWED.includes(eventName as CapiEventName)) {
    return Response.json({ ok: false, error: 'bad-event' }, { status: 400 })
  }
  if (!eventId || typeof eventId !== 'string' || eventId.length > 128) {
    return Response.json({ ok: false, error: 'bad-event-id' }, { status: 400 })
  }

  const headerList = await headers()
  const forwardedFor = headerList.get('x-forwarded-for')

  const result = await sendCapiEvent({
    eventName: eventName as CapiEventName,
    eventId,
    eventSourceUrl: body.eventSourceUrl ?? headerList.get('referer') ?? '',
    user: {
      ip: forwardedFor?.split(',')[0]?.trim(),
      userAgent: headerList.get('user-agent') ?? undefined,
      fbp: body.fbp,
      fbc: body.fbc ?? buildFbc(body.fbclid),
    },
    custom: body.custom,
  })

  if (!result.ok && !result.skipped) {
    console.error('[capi] %s failed: %s', eventName, result.error)
  }

  // Always 204: attribution problems are ours, not the visitor's.
  return new Response(null, { status: 204 })
}

