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

/*
 * Resolve exactly the way lib/video.ts does, or this reports files the site
 * never asks for: `file` overrides the slug, and two properties may share one
 * film (00.01 and 00.02 do), so the same object is only checked once.
 */
const skipped = []
const seen = new Set()
const expected = []

for (const p of properties) {
  if (!p.video) {
    skipped.push(p.code)
    continue
  }
  if (p.video.kind !== 'r2') continue

  const film = p.video.file ?? `${p.slug}.mp4`
  const poster = film.replace(/\.[^.]+$/, '.jpg')

  for (const [kind, name] of [['film  ', film], ['poster', poster]]) {
    if (seen.has(name)) continue
    seen.add(name)
    expected.push({ label: `${p.code} ${kind}`, url: `${base}/${name}` })
  }
}

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

if (skipped.length > 0) {
  console.log(`\n  (no film yet: ${skipped.join(', ')} — placeholder by design)`)
}

console.log(
  missing === 0
    ? `\nAll ${expected.length} expected files present.`
    : `\n${missing} of ${expected.length} missing — fix the names, then re-run.`,
)
process.exit(missing === 0 ? 0 : 1)
