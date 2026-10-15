#!/usr/bin/env node
/**
 * Checks that every film and poster the site expects actually exists in the
 * bucket, with the exact name it will be requested by.
 *
 * Filename mismatches are the single most likely reason a card stays on its
 * placeholder after upload — an accent kept in "provença", a capital .MP4,
 * a stray space, a nested folder. The site fails silently on those, so this
 * asks the bucket directly.
 *
 *   node scripts/check-media.mjs https://pub-xxxxxxxx.r2.dev
 */

import { properties } from '../content/properties.ts'

const base = process.argv[2]?.replace(/\/+$/, '')

if (!base) {
  console.error('Usage: node scripts/check-media.mjs <public-base-url>')
  process.exit(1)
}

const expected = properties.flatMap((p) => [
  { label: `${p.code} film  `, url: `${base}/${p.slug}.mp4` },
  { label: `${p.code} poster`, url: `${base}/${p.slug}.jpg` },
])

let missing = 0

for (const { label, url } of expected) {
  const name = url.split('/').pop()
  try {
    // HEAD first; some object stores answer it less reliably than a ranged GET.
    let res = await fetch(url, { method: 'HEAD' })
    if (!res.ok) {
      res = await fetch(url, { headers: { Range: 'bytes=0-0' } })
    }

    if (res.ok) {
      const size = Number(
        res.headers.get('content-length') ??
          res.headers.get('content-range')?.split('/')[1] ??
          0,
      )
      const mb = size ? `${(size / 1024 / 1024).toFixed(1)} MB` : 'size unknown'
      const type = res.headers.get('content-type') ?? '?'
      const warn = size > 15 * 1024 * 1024 ? '  ⚠ over 15 MB' : ''
      console.log(`  ok      ${label}  ${name}  (${mb}, ${type})${warn}`)
    } else {
      missing++
      console.log(`  MISSING ${label}  ${name}  -> HTTP ${res.status}`)
    }
  } catch (error) {
    missing++
    console.log(`  ERROR   ${label}  ${name}  -> ${error.message}`)
  }
}

console.log(
  missing === 0
    ? `\nAll ${expected.length} files present.`
    : `\n${missing} of ${expected.length} missing — fix the names, then re-run.`,
)
process.exit(missing === 0 ? 0 : 1)
