/**
 * Advertorials - the editorial-styled second template.
 *
 * These read as an article and sell softly. The `Advertisement` disclosure at
 * the top is NOT optional: EU consumer law (and Spain's AGCM/LSSI regime)
 * requires advertising that imitates editorial content to identify itself.
 * The template renders it automatically; don't remove it.
 *
 * Block types:
 *   p        paragraph
 *   h        sub-heading
 *   quote    pull quote
 *   list     bulleted points
 *   reel     embeds one residence from content/properties.ts by code
 *   cta      inline call to action, jumps to the form
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'reel'; code: string; caption?: string }
  | { type: 'cta'; label: string }

export type Advertorial = {
  slug: string
  /** Minutes, shown under the byline. */
  readingTime: number
  byline: string
  en: { title: string; standfirst: string; blocks: Block[] }
  es: { title: string; standfirst: string; blocks: Block[] }
}

export const advertorials: Advertorial[] = [
  {
    slug: 'what-27-days-actually-means',
    readingTime: 4,
    byline: 'Jana',
    en: {
      title: 'What “27 days to offer” actually means',
      standfirst:
        'Every agency in Barcelona quotes a time-to-sell figure. Almost none of them will tell you how it was calculated. Here is mine, with the awkward parts left in.',
      blocks: [
        {
          type: 'p',
          text: 'The number most agencies publish is days-on-market until listing removal. That counts the day a seller gives up and delists as a success. It is not a lie exactly, but it is not an answer to the question you are asking, which is: if I sign with you, when does someone make me an offer?',
        },
        {
          type: 'h',
          text: 'How I count it',
        },
        {
          type: 'p',
          text: 'My figure is median days from the film going live to an offer the seller accepted. Not first enquiry. Not first viewing. Accepted offer. Properties that did not sell stay in the dataset and drag the median up, which is the only honest way to do it.',
        },
        {
          type: 'list',
          items: [
            'Median, not mean - one freakishly fast sale cannot flatter the number.',
            'Last 18 months only, because the market in 2023 tells you nothing useful about today.',
            'Withdrawn and unsold instructions included, not quietly dropped.',
          ],
        },
        {
          type: 'reel',
          code: '00.04',
          caption:
            'Rector Triadó: ninety-two metres inside, sixty outside. A floorplan photographs badly and films well, which is most of the argument.',
        },
        {
          type: 'h',
          text: 'Why film changes the number',
        },
        {
          type: 'p',
          text: 'A buyer who has watched four minutes of a house walked end to end arrives at the door already knowing whether they like it. The viewings that follow are shorter, fewer and far more serious. Photographs invite tourists. Film filters them out before anyone wastes a Saturday.',
        },
        {
          type: 'quote',
          text: 'Four viewings, all genuine buyers. No tyre-kickers, which after our last agent felt like a luxury.',
          attribution: 'R. Okonkwo, Sant Gervasi',
        },
        {
          type: 'p',
          text: 'That is the whole mechanism. There is no growth hack underneath it - just the unglamorous fact that showing a house properly costs more up front and saves everyone months on the other end.',
        },
        {
          type: 'cta',
          label: 'Get a valuation with the real numbers',
        },
      ],
    },
    es: {
      title: 'Qué significa de verdad «27 días hasta la oferta»',
      standfirst:
        'Todas las agencias de Barcelona publican un plazo de venta. Casi ninguna explica cómo lo ha calculado. Aquí está el mío, con las partes incómodas incluidas.',
      blocks: [
        {
          type: 'p',
          text: 'La cifra que publica la mayoría es el tiempo en el mercado hasta que el anuncio desaparece. Eso cuenta como éxito el día en que un propietario se rinde y retira la casa. No es exactamente mentira, pero no responde a lo que estás preguntando: si firmo contigo, ¿cuándo me hace alguien una oferta?',
        },
        {
          type: 'h',
          text: 'Cómo lo calculo',
        },
        {
          type: 'p',
          text: 'Mi cifra es la mediana de días desde la publicación del vídeo hasta una oferta aceptada por el propietario. No la primera consulta. No la primera visita. Oferta aceptada. Las propiedades que no se vendieron siguen en los datos y empujan la mediana hacia arriba, que es la única forma honesta de hacerlo.',
        },
        {
          type: 'list',
          items: [
            'Mediana, no media: una venta excepcionalmente rápida no puede maquillar el dato.',
            'Solo los últimos 18 meses, porque el mercado de 2023 no dice nada útil sobre hoy.',
            'Incluye encargos retirados y no vendidos, sin descartarlos discretamente.',
          ],
        },
        {
          type: 'reel',
          code: '00.04',
          caption:
            'Rector Triadó: noventa y dos metros dentro, sesenta fuera. Una distribución así se fotografía mal y se filma bien, y ahí está casi todo el argumento.',
        },
        {
          type: 'h',
          text: 'Por qué el vídeo cambia la cifra',
        },
        {
          type: 'p',
          text: 'Un comprador que ha visto cuatro minutos de una casa recorrida de principio a fin llega a la puerta sabiendo ya si le gusta. Las visitas posteriores son más cortas, menos y mucho más serias. Las fotos atraen turistas. El vídeo los filtra antes de que nadie pierda un sábado.',
        },
        {
          type: 'quote',
          text: 'Cuatro visitas, todas de compradores reales. Ningún curioso, que después de nuestra agencia anterior fue un lujo.',
          attribution: 'R. Okonkwo, Sant Gervasi',
        },
        {
          type: 'p',
          text: 'Ese es todo el mecanismo. No hay ningún truco de crecimiento detrás: solo el hecho poco glamuroso de que mostrar bien una casa cuesta más al principio y ahorra meses a todo el mundo al final.',
        },
        {
          type: 'cta',
          label: 'Pide una valoración con cifras reales',
        },
      ],
    },
  },
]

export const findAdvertorial = (slug: string): Advertorial | undefined =>
  advertorials.find((item) => item.slug === slug)
