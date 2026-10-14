/**
 * The six residences.
 *
 * PLACEHOLDERS — no real films or imagery yet. Each entry renders an elegant
 * typographic placeholder until you fill in `video` and `poster`.
 *
 * To go live with a real reel:
 *   1. Upload the 9:16 film to your video host (Cloudflare Stream / Mux / Bunny).
 *   2. Set `video.src` to the HLS (.m3u8) or MP4 URL and `poster` to the still.
 *   3. That's it — the card and the player pick it up automatically.
 */

export type PropertyStatus = 'new' | 'available' | 'reserved' | 'sold'

export type Property = {
  /** Catalogue code, in the reference's numeric house style. */
  code: string
  slug: string
  status: PropertyStatus
  /** Tone used by the typographic placeholder. Harmless once a poster exists. */
  tone: string
  price: { amount: number; currency: 'EUR' }
  area: number
  beds: number
  name: { en: string; es: string }
  location: { en: string; es: string }
  /** One-line hook. Keep it under ~70 characters. */
  hook: { en: string; es: string }
  poster: string | null
  video: { src: string; type: 'hls' | 'mp4' } | null
}

export const properties: Property[] = [
  {
    code: '00.01',
    slug: 'cortijo-del-viento',
    status: 'new',
    tone: '#2f3733',
    price: { amount: 2850000, currency: 'EUR' },
    area: 486,
    beds: 5,
    name: { en: 'Cortijo del Viento', es: 'Cortijo del Viento' },
    location: { en: 'Benahavís', es: 'Benahavís' },
    hook: {
      en: 'Restored finca, twelve hectares, no neighbours in any direction.',
      es: 'Finca restaurada, doce hectáreas, sin vecinos en ninguna dirección.',
    },
    poster: null,
    video: null,
  },
  {
    code: '00.02',
    slug: 'casa-lumbre',
    status: 'new',
    tone: '#3a332c',
    price: { amount: 1240000, currency: 'EUR' },
    area: 212,
    beds: 3,
    name: { en: 'Casa Lumbre', es: 'Casa Lumbre' },
    location: { en: 'Marbella Old Town', es: 'Casco Antiguo, Marbella' },
    hook: {
      en: 'Three floors inside the old walls, rooftop facing La Concha.',
      es: 'Tres plantas dentro de la muralla, azotea frente a La Concha.',
    },
    poster: null,
    video: null,
  },
  {
    code: '00.03',
    slug: 'mirador-ocho',
    status: 'available',
    tone: '#2b3138',
    price: { amount: 3400000, currency: 'EUR' },
    area: 540,
    beds: 6,
    name: { en: 'Mirador Ocho', es: 'Mirador Ocho' },
    location: { en: 'La Zagaleta', es: 'La Zagaleta' },
    hook: {
      en: 'Cantilevered over the valley. Gibraltar visible on a clear day.',
      es: 'En voladizo sobre el valle. Gibraltar visible en días claros.',
    },
    poster: null,
    video: null,
  },
  {
    code: '00.04',
    slug: 'planta-mar',
    status: 'reserved',
    tone: '#2c3539',
    price: { amount: 895000, currency: 'EUR' },
    area: 148,
    beds: 2,
    name: { en: 'Planta Mar', es: 'Planta Mar' },
    location: { en: 'Estepona Marina', es: 'Puerto de Estepona' },
    hook: {
      en: 'Ground-floor duplex, private garden, forty metres from the water.',
      es: 'Dúplex en planta baja, jardín privado, a cuarenta metros del agua.',
    },
    poster: null,
    video: null,
  },
  {
    code: '00.05',
    slug: 'villa-serrana',
    status: 'sold',
    tone: '#343029',
    price: { amount: 1675000, currency: 'EUR' },
    area: 320,
    beds: 4,
    name: { en: 'Villa Serrana', es: 'Villa Serrana' },
    location: { en: 'Sotogrande Alto', es: 'Sotogrande Alto' },
    hook: {
      en: 'Sold in nine days at asking. Kept here because the film is the pitch.',
      es: 'Vendida en nueve días al precio pedido. Aquí porque el vídeo lo explica todo.',
    },
    poster: null,
    video: null,
  },
  {
    code: '00.06',
    slug: 'atico-norte',
    status: 'sold',
    tone: '#30343a',
    price: { amount: 1120000, currency: 'EUR' },
    area: 176,
    beds: 3,
    name: { en: 'Ático Norte', es: 'Ático Norte' },
    location: { en: 'Nueva Andalucía', es: 'Nueva Andalucía' },
    hook: {
      en: 'Penthouse, 90m² terrace, sold to the second viewer.',
      es: 'Ático, terraza de 90 m², vendido al segundo visitante.',
    },
    poster: null,
    video: null,
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
