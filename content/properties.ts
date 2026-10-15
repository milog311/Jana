/**
 * The six residences — Barcelona.
 *
 * Facts (floor, surface, bedrooms, bathrooms, price) are taken verbatim from
 * the brief. Neighbourhoods are INFERRED from the street names and should be
 * confirmed. Hooks are written only from the given facts — nothing about
 * light, condition, views or finish is claimed, because none of that was
 * supplied.
 *
 * PUBLISHING THE FILMS
 * `{ kind: 'r2' }` resolves to `<R2 base>/<slug>.mp4`, with the poster at the
 * same name and a .jpg extension. `file` overrides that where the film is not
 * named after the slug.
 *
 * 00.01 and 00.02 deliberately share one film: the reel walks both flats in
 * sequence and quotes both sets of figures ("el primero, 64 m, 14 de terraza
 * … el segundo, 70 m, 18 de terraza"), so there is no separate film to point
 * each card at.
 *
 * 00.04 has no film yet and renders the placeholder.
 *
 * Until NEXT_PUBLIC_R2_PUBLIC_BASE_URL is set, `videoSrc()` returns null and
 * every card falls back to the placeholder.
 */

import type { VideoSource } from '@/lib/video'

export type PropertyStatus = 'new' | 'available' | 'reserved' | 'sold'

export type Property = {
  /** Catalogue index, kept as a secondary marker beside the street name. */
  code: string
  slug: string
  status: PropertyStatus
  /** Tone for the typographic placeholder. Unused once a poster exists. */
  tone: string
  price: { amount: number; currency: 'EUR' }
  /** Square metres. `exterior` is terrace/patio, shown as "64 + 14 m²". */
  area: { interior: number; exterior?: number }
  /** `extra` covers the "2 + 1" case — two bedrooms plus a small third room. */
  beds: { main: number; extra?: number }
  baths: number
  floor: { en: string; es: string }
  name: string
  neighbourhood: { en: string; es: string }
  hook: { en: string; es: string }
  /** Overrides the derived poster when set. */
  poster: string | null
  /** Where the film is hosted. See lib/video.ts. */
  video: VideoSource | null
}

export const properties: Property[] = [
  {
    code: '00.01',
    slug: 'provenca-balmes-1',
    status: 'available',
    tone: '#2f3733',
    price: { amount: 860000, currency: 'EUR' },
    area: { interior: 64, exterior: 14 },
    beds: { main: 2 },
    baths: 2,
    floor: { en: '7th floor (actual)', es: '7ª planta real' },
    name: 'Provença / Balmes (1)',
    neighbourhood: { en: 'Eixample', es: 'Eixample' },
    hook: {
      en: 'Seventh floor on the Provença–Balmes corner, with a 14 m² terrace.',
      es: 'Séptima planta en la esquina Provença–Balmes, con terraza de 14 m².',
    },
    poster: null,
    video: { kind: 'r2', file: 'provenca-balmes.mp4' },
  },
  {
    code: '00.02',
    slug: 'provenca-balmes-2',
    status: 'available',
    tone: '#3a332c',
    price: { amount: 900000, currency: 'EUR' },
    area: { interior: 70, exterior: 18 },
    beds: { main: 2 },
    baths: 2,
    floor: { en: '7th floor (actual)', es: '7ª planta real' },
    name: 'Provença / Balmes (2)',
    neighbourhood: { en: 'Eixample', es: 'Eixample' },
    hook: {
      en: 'The larger of the two seventh-floor homes — 70 m² and an 18 m² terrace.',
      es: 'La mayor de las dos viviendas de la séptima — 70 m² y terraza de 18 m².',
    },
    poster: null,
    video: { kind: 'r2', file: 'provenca-balmes.mp4' },
  },
  {
    code: '00.03',
    slug: 'placa-de-les-olles',
    status: 'available',
    tone: '#2b3138',
    price: { amount: 400000, currency: 'EUR' },
    area: { interior: 60 },
    beds: { main: 2 },
    baths: 1,
    floor: { en: '1st floor', es: '1ª planta' },
    name: 'Plaça de les Olles',
    neighbourhood: { en: 'El Born', es: 'El Born' },
    hook: {
      en: 'Two bedrooms on a square in El Born, at the lowest entry in the collection.',
      es: 'Dos dormitorios en una plaza del Born, el precio más accesible de la colección.',
    },
    poster: null,
    video: { kind: 'r2' },
  },
  {
    code: '00.04',
    slug: 'rector-triado',
    status: 'available',
    tone: '#2c3539',
    price: { amount: 585000, currency: 'EUR' },
    area: { interior: 92, exterior: 60 },
    beds: { main: 2, extra: 1 },
    baths: 2,
    floor: { en: 'Ground floor', es: 'Planta baja' },
    name: 'Rector Triadó',
    neighbourhood: { en: 'Hostafrancs', es: 'Hostafrancs' },
    hook: {
      en: 'Ground floor with 60 m² of private outdoor space — the most exterior metres here.',
      es: 'Planta baja con 60 m² de exterior privado — los metros exteriores más amplios.',
    },
    poster: null,
    video: null, // Rector Triadó: no film shot yet
  },
  {
    code: '00.05',
    slug: 'torrijos',
    status: 'available',
    tone: '#343029',
    price: { amount: 570000, currency: 'EUR' },
    area: { interior: 65 },
    beds: { main: 2 },
    baths: 2,
    floor: { en: '1st floor', es: '1ª planta' },
    name: 'Torrijos',
    neighbourhood: { en: 'Vila de Gràcia', es: 'Vila de Gràcia' },
    hook: {
      en: 'Two bedrooms, two bathrooms, first floor in the middle of Gràcia.',
      es: 'Dos dormitorios, dos baños, primera planta en pleno Gràcia.',
    },
    poster: null,
    video: { kind: 'r2' },
  },
  {
    code: '00.06',
    slug: 'bruc',
    status: 'available',
    tone: '#30343a',
    price: { amount: 920000, currency: 'EUR' },
    area: { interior: 157 },
    beds: { main: 3 },
    baths: 2,
    floor: { en: '2nd floor', es: '2ª planta' },
    name: 'Bruc',
    neighbourhood: { en: 'Dreta de l’Eixample', es: 'Dreta de l’Eixample' },
    hook: {
      en: '157 m² on Carrer del Bruc — the largest floorplan in the collection.',
      es: '157 m² en el carrer del Bruc — la superficie más amplia de la colección.',
    },
    poster: null,
    video: { kind: 'r2' },
  },
]

export const formatPrice = (
  amount: number,
  currency: 'EUR',
  locale: string,
): string =>
  new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)

/** "64 + 14 m²" when there is outdoor space, "60 m²" when there isn't. */
export const formatArea = (area: Property['area']): string =>
  area.exterior ? `${area.interior} + ${area.exterior} m²` : `${area.interior} m²`

/** "2 + 1" for the extra-room case, otherwise "2". */
export const formatBeds = (beds: Property['beds']): string =>
  beds.extra ? `${beds.main} + ${beds.extra}` : String(beds.main)
