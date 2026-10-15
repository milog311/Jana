# Jana — landing pages

Reel-driven landing pages and advertorials for a Costa del Sol real-estate
personal brand. Bilingual (EN/ES), built for cold Meta traffic, optimised for
email + phone capture.

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · deployed on Vercel.

> **Note on Next 16:** `middleware.ts` is now `proxy.ts`, and `params`,
> `cookies()` and `headers()` are all async. `next lint` is gone — run
> `npx eslint .`. Read `node_modules/next/dist/docs/` before changing routing.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

`/` redirects to `/en` or `/es` based on the visitor's `Accept-Language`.

| Route | What it is |
| --- | --- |
| `/[lang]` | The lander |
| `/[lang]/a/[slug]` | Advertorial template |
| `/[lang]/privacy`, `/[lang]/cookies` | Legal pages |
| `/api/lead` | Form submission → lead delivery + CAPI `Lead` |
| `/api/capi` | Browser events mirrored server-side |

---

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables.

| Variable | Secret? | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | no | Canonical URLs, CAPI `event_source_url` |
| `NEXT_PUBLIC_FB_PIXEL_ID` | no | Pixel ID (ships to the browser by design) |
| `FB_CAPI_ACCESS_TOKEN` | **yes** | Conversions API token — never prefix with `NEXT_PUBLIC_` |
| `FB_TEST_EVENT_CODE` | no | Routes events to Events Manager → Test Events |
| `FB_GRAPH_VERSION` | no | Defaults to `v23.0`; bump when Meta deprecates it |
| `NEXT_PUBLIC_R2_PUBLIC_BASE_URL` | no | Public base URL of the R2 bucket — see *Video* below |
| `NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE` | no | Only if you switch from R2 to Cloudflare Stream |
| `LEAD_WEBHOOK_URL` | **yes** | Where leads are POSTed as JSON (CRM/Zapier/Make/Sheet) |

**With no variables set the site still runs.** Tracking no-ops and leads are
written to the server log, so you can deploy before the ad account is ready.

---

## How tracking works

Every conversion fires **twice on purpose**:

1. **Browser** — Meta Pixel, fast, carries the visitor's own cookies.
2. **Server** — Conversions API, survives ad blockers and Safari ITP.

Both carry the same `event_id`, which is how Meta merges them into one
conversion. Remove it and every lead counts twice.

| Event | When | Where from |
| --- | --- | --- |
| `PageView` | On consent | Browser + CAPI |
| `ViewContent` | A residence film is opened — carries the property code, so you can see *which film sells* | Browser + CAPI |
| `Lead` | Form submitted | CAPI (server, authoritative) + browser, deduped |

PII (email, phone, name) is SHA-256 hashed server-side before it ever reaches
Meta — see `lib/hash.ts`. It is never sent from the browser.

### Setup

1. Events Manager → your dataset → **Settings** → generate a **Conversions API
   access token** → `FB_CAPI_ACCESS_TOKEN`.
2. Set `FB_TEST_EVENT_CODE` and submit the form. Events should appear in
   **Test Events** within seconds, marked as received from both *Browser* and
   *Server*, deduplicated.
3. Remove `FB_TEST_EVENT_CODE` to go live.

---

## Consent — two separate things

GDPR treats these as different purposes, so they are two different controls:

- **Cookie banner** (`components/ConsentBanner.tsx`) — governs *browser* tracking.
  No Meta script is requested until the visitor accepts. Rejecting leaves the
  site fully functional.
- **Form checkbox** (`components/LeadForm.tsx`) — explicit consent to be
  contacted. This is the lawful basis for the server-side `Lead` event, which
  is why that fires independently of the cookie banner.

> ⚠️ `content/legal.ts` is a **template with `[PLACEHOLDERS]`, not legal advice.**
> Fill it in and have a lawyer in your jurisdiction review it before running
> paid traffic. Spain also requires LSSI-CE identification details.

---

## Adding content

**A residence** — edit `content/properties.ts`. The films are **not** wired up
per property: every entry is set to `{ kind: 'r2' }`, which resolves to
`<base>/<slug>.mp4` with a poster at `<base>/<slug>.jpg`. Uploading twelve
correctly-named files and setting one environment variable publishes all six.

Until `NEXT_PUBLIC_R2_PUBLIC_BASE_URL` is set, every card falls back to a
designed typographic placeholder — which is why the page looks finished
before the films exist.

### Video

Expected filenames in the bucket, one `.mp4` and one `.jpg` each:

```
provenca-balmes-1    provenca-balmes-2    placa-de-les-olles
rector-triado        torrijos             bruc
```

Encode vertical, and **always with `-movflags +faststart`** — without it the
MP4 index sits at the end of the file and the browser downloads the whole
thing before the first frame appears:

```bash
ffmpeg -i input.mov -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
  -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart output.mp4

ffmpeg -i output.mp4 -ss 1 -frames:v 1 -q:v 4 output.jpg
```

Playback is a plain `<video>`, not an iframe embed, so the player is ours to
style and six reels don't mean six iframes. `play()` is called explicitly
rather than relying on the `autoPlay` attribute — see the comment in
`components/VideoPlayer.tsx`.

**R2 serves exactly the file you upload.** There is no transcoding and no
adaptive bitrate, so a viewer on weak mobile data gets the same bitrate as
everyone else. Keep each file under ~15 MB. If reels start stalling for ad
traffic, switching to Cloudflare Stream is a config change plus one field per
property — `lib/video.ts` already supports it, including lazy-loaded `hls.js`
for non-Safari browsers.

**An advertorial** — add an entry to `content/advertorials.ts` with `en` and
`es` copy. Block types: `p`, `h`, `quote`, `list`, `reel` (embeds a residence
by code), `cta`. The *Advertisement* disclosure renders automatically and is
legally required — don't remove it.

**Copy** — `dictionaries/en.json` and `dictionaries/es.json`. Keys must stay in
sync between the two.

**Design** — every colour, font and spacing token is at the top of
`app/globals.css`. Nothing else hardcodes a colour, so rebranding is one file.

---

## Conventions worth knowing

- **Scroll reveals are progressive enhancement.** The hidden state is scoped to
  `html.js`, set by an inline script in `app/[lang]/layout.tsx`. Without JS every
  section renders visible. Never move that script into a manual `<head>` — the
  App Router injects the stylesheet there and rendering your own suppresses it,
  shipping the page unstyled.
- **The FAQ uses native `<details>`** — no JS, correct for keyboard and screen
  readers for free.
- **The form has a honeypot** (`website`). Bot submissions are accepted and
  silently discarded so they don't retry.

## Checks

```bash
npx eslint .      # lint   (next lint was removed in Next 16)
npx tsc --noEmit  # types
npm run build     # build
```
