import { headers } from 'next/headers'
import { buildFbc, sendCapiEvent, splitName } from '@/lib/capi'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

type LeadBody = {
  name?: string
  email?: string
  phone?: string
  interest?: string
  property?: string
  consent?: boolean
  locale?: string
  fbp?: string
  fbc?: string
  fbclid?: string
  /** Honeypot — real humans never see this field, so a value means a bot. */
  website?: string
}

export async function POST(request: Request) {
  let body: LeadBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'bad-json' }, { status: 400 })
  }

  // Silently accept and discard bot submissions so they don't retry.
  if (body.website) return Response.json({ ok: true, eventId: null })

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const phone = (body.phone ?? '').trim()

  const errors: string[] = []
  if (name.length < 2 || name.length > 120) errors.push('name')
  if (!EMAIL_RE.test(email) || email.length > 200) errors.push('email')
  if (phone.replace(/\D/g, '').length < 8) errors.push('phone')
  if (body.consent !== true) errors.push('consent')

  if (errors.length > 0) {
    return Response.json({ ok: false, fields: errors }, { status: 422 })
  }

  const headerList = await headers()
  const eventId = crypto.randomUUID()
  const submittedAt = new Date().toISOString()

  const lead = {
    name,
    email,
    phone,
    interest: body.interest ?? 'unknown',
    property: body.property ?? 'any',
    locale: body.locale ?? 'en',
    consent: true,
    consentText: 'marketing-contact-and-privacy-policy',
    submittedAt,
    eventId,
    userAgent: headerList.get('user-agent') ?? null,
  }

  // 1. Deliver the lead. This is the part that must not fail silently.
  const delivery = await deliverLead(lead)

  // 2. Attribute it. The visitor ticked an explicit consent box to get here,
  //    which is the lawful basis for this send — independent of the cookie
  //    banner, which governs browser-side tracking only.
  const { firstName, lastName } = splitName(name)
  const capi = await sendCapiEvent({
    eventName: 'Lead',
    eventId,
    eventSourceUrl: headerList.get('referer') ?? '',
    user: {
      email,
      phone,
      firstName,
      lastName,
      ip: headerList.get('x-forwarded-for')?.split(',')[0]?.trim(),
      userAgent: headerList.get('user-agent') ?? undefined,
      fbp: body.fbp,
      fbc: body.fbc ?? buildFbc(body.fbclid),
    },
    custom: {
      content_name: lead.property,
      lead_type: lead.interest,
      locale: lead.locale,
    },
  })

  if (!capi.ok && !capi.skipped) {
    console.error('[lead] CAPI failed for %s: %s', eventId, capi.error)
  }

  if (!delivery.ok) {
    console.error('[lead] DELIVERY FAILED for %s: %s', eventId, delivery.error)
    return Response.json(
      { ok: false, error: 'delivery-failed' },
      { status: 502 },
    )
  }

  return Response.json({ ok: true, eventId })
}

/**
 * Sends the lead wherever it needs to go.
 *
 * With no LEAD_WEBHOOK_URL configured it logs and reports success, so the
 * form works end to end before a CRM exists. Point LEAD_WEBHOOK_URL at a
 * CRM, Zapier/Make/n8n hook or a Sheets endpoint and leads go there instead.
 */
async function deliverLead(
  lead: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const webhook = process.env.LEAD_WEBHOOK_URL

  if (!webhook) {
    console.info('[lead] no LEAD_WEBHOOK_URL set, logging only:', lead)
    return { ok: true }
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(lead),
      cache: 'no-store',
    })
    if (!response.ok) return { ok: false, error: `webhook-${response.status}` }
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'webhook-network-error',
    }
  }
}
