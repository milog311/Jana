# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Specifically, already hit in this repo:

- `middleware.ts` is now **`proxy.ts`**, exporting a function named `proxy`.
  Node runtime only; the edge runtime is not supported there.
- `params`, `searchParams`, `cookies()` and `headers()` are **async** — await them.
- `next lint` is **removed**. Run `npx eslint .`.
- ESLint uses **flat config**; `eslint-config-next` exports flat arrays directly,
  so `FlatCompat` breaks with a circular-structure error.
- Do **not** render a manual `<head>` in a layout — it suppresses the App
  Router's stylesheet injection and the page ships unstyled.

See README.md for the project's own conventions.
