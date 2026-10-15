'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { Property } from '@/content/properties'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { Locale } from '@/lib/locales'
import { readCookie, readFbclid, trackPixel } from '@/lib/pixel'
import Reveal from './Reveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

type FieldErrors = Partial<
  Record<'name' | 'email' | 'phone' | 'consent' | 'generic', string>
>

export default function LeadForm({
  dict,
  locale,
  properties,
}: {
  dict: Dictionary
  locale: Locale
  properties: Property[]
}) {
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const consent = data.get('consent') === 'on'

    const next: FieldErrors = {}
    if (name.length < 2) next.name = dict.form.errors.name
    if (!EMAIL_RE.test(email)) next.email = dict.form.errors.email
    if (phone.replace(/\D/g, '').length < 8) next.phone = dict.form.errors.phone
    if (!consent) next.consent = dict.form.errors.consent

    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setErrors({})
    setPending(true)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          consent,
          locale,
          interest: String(data.get('interest') ?? 'both'),
          property: String(data.get('property') ?? 'any'),
          website: String(data.get('website') ?? ''),
          fbp: readCookie('_fbp'),
          fbc: readCookie('_fbc'),
          fbclid: readFbclid(),
        }),
      })

      if (!response.ok) {
        setErrors({ generic: dict.form.errors.generic })
        return
      }

      const result = (await response.json()) as {
        ok: boolean
        eventId: string | null
      }

      // The server already sent Lead to the Conversions API. Firing the
      // browser pixel with the *same* id lets Meta merge them into one
      // conversion instead of counting two.
      if (result.eventId) {
        trackPixel('Lead', result.eventId, {
          content_name: String(data.get('property') ?? 'any'),
          lead_type: String(data.get('interest') ?? 'both'),
        })
      }

      form.reset()
      setDone(true)
    } catch {
      setErrors({ generic: dict.form.errors.generic })
    } finally {
      setPending(false)
    }
  }

  return (
    <section id="enquire" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
      <Reveal>
        <div className="grid gap-12 rounded-sm border border-line bg-paper-dim/50 p-6 sm:p-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p className="label text-muted">{dict.form.label}</p>
            <h2 className="display mt-5 text-[8vw] sm:text-[3rem]">
              {dict.form.heading}
            </h2>
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted">
              {dict.form.sub}
            </p>
          </div>

          <div className="md:col-span-7">
            {done ? (
              <div
                className="flex h-full flex-col justify-center rounded-sm border border-line bg-paper p-8"
                role="status"
                aria-live="polite"
              >
                <h3 className="display text-3xl">{dict.form.successHeading}</h3>
                <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-muted">
                  {dict.form.successBody}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="name"
                    label={dict.form.name}
                    placeholder={dict.form.namePlaceholder}
                    autoComplete="name"
                    error={errors.name}
                    className="sm:col-span-2"
                  />
                  <Field
                    name="email"
                    type="email"
                    label={dict.form.email}
                    placeholder={dict.form.emailPlaceholder}
                    autoComplete="email"
                    inputMode="email"
                    error={errors.email}
                  />
                  <Field
                    name="phone"
                    type="tel"
                    label={dict.form.phone}
                    placeholder={dict.form.phonePlaceholder}
                    autoComplete="tel"
                    inputMode="tel"
                    error={errors.phone}
                  />

                  <Select name="interest" label={dict.form.interest}>
                    <option value="buying">{dict.form.interestOptions.buying}</option>
                    <option value="selling">{dict.form.interestOptions.selling}</option>
                    <option value="both">{dict.form.interestOptions.both}</option>
                  </Select>

                  <Select name="property" label={dict.form.property}>
                    <option value="any">{dict.form.propertyAny}</option>
                    {properties
                      .filter((property) => property.status !== 'sold')
                      .map((property) => (
                        <option key={property.code} value={property.code}>
                          {property.code} - {property.name}
                        </option>
                      ))}
                  </Select>
                </div>

                {/* Honeypot: off-screen, never announced, bots fill it anyway. */}
                <div aria-hidden="true" className="absolute left-[-9999px]">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <label className="mt-7 flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    name="consent"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span className="text-muted">
                    {dict.form.consent}{' '}
                    <Link
                      href={`/${locale}/privacy`}
                      className="text-ink underline decoration-line underline-offset-2 hover:decoration-ink"
                    >
                      {dict.form.consentLink}
                    </Link>
                    .
                  </span>
                </label>

                {errors.consent && <Error message={errors.consent} />}

                <p className="mt-3 text-xs leading-relaxed text-muted/80">
                  {dict.form.consentNote}
                </p>

                <button
                  type="submit"
                  disabled={pending}
                  className="label mt-8 w-full rounded-full bg-ink px-8 py-4.5 text-paper transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
                >
                  {pending ? dict.form.submitting : dict.form.submit}
                </button>

                {errors.generic && <Error message={errors.generic} />}
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Field({
  name,
  label,
  placeholder,
  error,
  type = 'text',
  autoComplete,
  inputMode,
  className = '',
}: {
  name: string
  label: string
  placeholder?: string
  error?: string
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'tel' | 'text'
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label block text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-2.5 w-full rounded-sm border bg-paper px-4 py-3.5 text-[0.9375rem] outline-none transition-colors placeholder:text-muted/50 focus:border-ink ${
          error ? 'border-red-700' : 'border-line'
        }`}
      />
      {error && <Error id={`${name}-error`} message={error} />}
    </div>
  )
}

function Select({
  name,
  label,
  children,
}: {
  name: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={name} className="label block text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="mt-2.5 w-full appearance-none rounded-sm border border-line bg-paper px-4 py-3.5 text-[0.9375rem] outline-none transition-colors focus:border-ink"
      >
        {children}
      </select>
    </div>
  )
}

function Error({ message, id }: { message: string; id?: string }) {
  return (
    <p id={id} className="mt-2 text-xs text-red-700" role="alert">
      {message}
    </p>
  )
}
