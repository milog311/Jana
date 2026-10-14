'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { Locale } from '@/lib/locales'
import { useConsent } from '@/lib/consent'

/**
 * Cookie consent.
 *
 * Governs browser-side tracking only. The marketing-outreach consent the
 * visitor gives by ticking the box on the enquiry form is a separate, explicit
 * consent — GDPR treats them as two different purposes, so they are two
 * different controls here.
 */
export default function ConsentBanner({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: Locale
}) {
  const { consent, ready, accept, reject, save } = useConsent()
  const [managing, setManaging] = useState(false)
  const [marketing, setMarketing] = useState(true)

  // `ready` prevents the banner flashing before stored consent is read.
  if (!ready || consent) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line-dark bg-ink p-5 text-paper sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-label={dict.consent.heading}
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[62ch]">
          <p className="label text-paper/50">{dict.consent.heading}</p>
          <p className="mt-2.5 text-sm leading-relaxed text-paper/75">
            {dict.consent.body}{' '}
            <Link
              href={`/${locale}/cookies`}
              className="underline decoration-paper/35 underline-offset-2 hover:decoration-paper"
            >
              {dict.consent.policy}
            </Link>
            .
          </p>

          {managing && (
            <div className="mt-5 space-y-4 border-t border-line-dark pt-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked
                  disabled
                  id="c-necessary"
                  className="mt-0.5 h-4 w-4 shrink-0"
                />
                <label htmlFor="c-necessary" className="text-sm">
                  <span className="font-medium">{dict.consent.necessary}</span>
                  <span className="mt-1 block text-xs text-paper/55">
                    {dict.consent.necessaryNote}
                  </span>
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="c-marketing"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-paper"
                />
                <label htmlFor="c-marketing" className="cursor-pointer text-sm">
                  <span className="font-medium">{dict.consent.marketing}</span>
                  <span className="mt-1 block text-xs text-paper/55">
                    {dict.consent.marketingNote}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {managing ? (
            <button
              type="button"
              onClick={() => save(marketing)}
              className="label rounded-full bg-paper px-6 py-3.5 text-ink transition-opacity hover:opacity-85"
            >
              {dict.consent.save}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setManaging(true)}
                className="label px-2 py-3.5 text-paper/60 transition-colors hover:text-paper"
              >
                {dict.consent.manage}
              </button>
              <button
                type="button"
                onClick={reject}
                className="label rounded-full border border-paper/25 px-6 py-3.5 text-paper/85 transition-colors hover:border-paper"
              >
                {dict.consent.reject}
              </button>
              <button
                type="button"
                onClick={accept}
                className="label rounded-full bg-paper px-6 py-3.5 text-ink transition-opacity hover:opacity-85"
              >
                {dict.consent.accept}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
