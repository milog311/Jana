'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'jana.consent.v1'

export type ConsentState = {
  /** Meta Pixel + Conversions API attribution. */
  marketing: boolean
  decidedAt: string
}

/* ──────────────────────────────────────────────────────────────
   localStorage as an external store.
   `useSyncExternalStore` is the right tool here: the stored choice is
   external state, so the first client render already sees the real value
   instead of a setState-in-effect that would cascade a second render and
   flash the banner at visitors who already answered.
   ────────────────────────────────────────────────────────────── */

const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  // Keeps tabs in sync when the choice is made in another one.
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private mode or blocked storage — treat as undecided.
    return null
  }
}

function parse(raw: string | null): ConsentState | null {
  if (!raw) return null
  try {
    const value = JSON.parse(raw) as Partial<ConsentState>
    if (typeof value?.marketing !== 'boolean') return null
    return {
      marketing: value.marketing,
      decidedAt: value.decidedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

/* getSnapshot must return a stable reference or React re-renders forever,
   so the parsed value is cached against the raw string it came from. */
let cachedRaw: string | null = null
let cachedValue: ConsentState | null = null

function getSnapshot(): ConsentState | null {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = parse(raw)
  }
  return cachedValue
}

/** On the server nothing is known, so nothing may load. */
const getServerSnapshot = (): ConsentState | null => null

function write(next: ConsentState | null) {
  try {
    if (next === null) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
  } catch {
    // Fall through: the in-memory snapshot below still applies this session.
    cachedRaw = next === null ? null : JSON.stringify(next)
    cachedValue = next
  }
  emit()
}

/* Hydration flag, also as an external store so there is no effect involved. */
const subscribeNothing = () => () => {}
const onClient = () => true
const onServer = () => false

export type UseConsent = {
  /** `null` until the visitor has chosen — nothing may load in that window. */
  consent: ConsentState | null
  /** False during SSR and the first paint, so the banner never flashes. */
  ready: boolean
  accept: () => void
  reject: () => void
  save: (marketing: boolean) => void
  reopen: () => void
}

export function useConsent(): UseConsent {
  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )
  const ready = useSyncExternalStore(subscribeNothing, onClient, onServer)

  const save = useCallback((marketing: boolean) => {
    write({ marketing, decidedAt: new Date().toISOString() })
  }, [])

  const reopen = useCallback(() => write(null), [])

  return useMemo(
    () => ({
      consent,
      ready,
      accept: () => save(true),
      reject: () => save(false),
      save,
      reopen,
    }),
    [consent, ready, save, reopen],
  )
}
