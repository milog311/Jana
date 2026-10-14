import 'server-only'
import { createHash } from 'node:crypto'

const sha256 = (value: string): string =>
  createHash('sha256').update(value, 'utf8').digest('hex')

/** Meta requires lowercase, trimmed, SHA-256 hex for all PII fields. */
export const hashEmail = (email: string): string | undefined => {
  const normalised = email.trim().toLowerCase()
  return normalised ? sha256(normalised) : undefined
}

/**
 * Meta wants digits only, including country code, with no `+` or separators.
 * A number with no country code cannot be normalised reliably, so it is
 * dropped rather than guessed — a wrong country code poisons matching.
 */
export const hashPhone = (phone: string): string | undefined => {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.length < 8 || digits.length > 15) return undefined
  return sha256(digits)
}

export const hashName = (name: string): string | undefined => {
  const normalised = name.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalised ? sha256(normalised) : undefined
}
