/**
 * Legal copy.
 *
 * ⚠️  TEMPLATE, NOT LEGAL ADVICE. Every [SQUARE BRACKET] is a placeholder you
 * must fill in, and the whole text needs review by a lawyer qualified in your
 * jurisdiction before you run paid traffic to it. Spain additionally requires
 * LSSI-CE identification details (name, NIF, registered address) - those live
 * in the `identity` section below.
 */

import type { LegalSection } from '@/components/LegalPage'

type LegalDoc = { title: string; updated: string; sections: LegalSection[] }

export const legal: Record<'en' | 'es', { privacy: LegalDoc; cookies: LegalDoc }> = {
  en: {
    privacy: {
      title: 'Privacy policy',
      updated: 'Last updated [DATE]',
      sections: [
        {
          heading: 'Who is responsible for your data',
          body: [
            'Data controller: [FULL LEGAL NAME], [NIF / TAX ID], [REGISTERED ADDRESS]. Contact: [EMAIL].',
            'If you are in the EU you may contact our data protection contact at [EMAIL] for any question about this policy.',
          ],
        },
        {
          heading: 'What we collect and why',
          body: [
            'When you submit the enquiry form we collect your name, email address, telephone number, and what you told us you are interested in. We use these solely to respond to your enquiry and, where you consented, to contact you about properties and services.',
            'Legal basis: your explicit consent (GDPR Art. 6(1)(a)), given by ticking the box on the form. You may withdraw it at any time without affecting the lawfulness of processing before withdrawal.',
          ],
        },
        {
          heading: 'Advertising measurement',
          body: [
            'If you accept advertising cookies we load the Meta Pixel and send conversion events to Meta Platforms Ireland Ltd via the Conversions API, including a hashed (SHA-256) form of your email address and phone number. This lets us measure which adverts produce enquiries.',
            'This involves a transfer of personal data to Meta, which may process it outside the EEA under the EU–US Data Privacy Framework and standard contractual clauses. If you reject advertising cookies, no pixel is loaded.',
          ],
        },
        {
          heading: 'How long we keep it',
          body: [
            'Enquiry data is retained for [RETENTION PERIOD, e.g. 24 months] after our last contact with you, or until you ask us to delete it, whichever is sooner.',
          ],
        },
        {
          heading: 'Who else sees it',
          body: [
            'Your details are never sold and never passed to other estate agencies. We share them only with: [HOSTING PROVIDER - Vercel Inc.], [CRM / EMAIL PROVIDER], and Meta for the advertising measurement described above.',
          ],
        },
        {
          heading: 'Your rights',
          body: [
            'You have the right to access, rectify, erase, restrict and object to the processing of your data, and to data portability. Write to [EMAIL] and we will respond within one month.',
            'You may also lodge a complaint with your supervisory authority - in Spain, the Agencia Española de Protección de Datos (aepd.es).',
          ],
        },
      ],
    },
    cookies: {
      title: 'Cookie policy',
      updated: 'Last updated [DATE]',
      sections: [
        {
          heading: 'What we use',
          body: [
            'Strictly necessary: a single local-storage entry (jana.consent.v1) that remembers your cookie choice. No consent needed, and it never leaves your browser.',
            'Advertising measurement (consent required): the Meta Pixel sets _fbp and, if you arrived from a Meta advert, _fbc. These identify your browser to Meta so enquiries can be attributed to the advert that produced them. Retention: up to 90 days.',
          ],
        },
        {
          heading: 'Nothing loads before you choose',
          body: [
            'No advertising script is requested until you accept. Rejecting leaves the site fully functional - we simply cannot tell which advert brought you here.',
          ],
        },
        {
          heading: 'Changing your mind',
          body: [
            'Clear this site’s data in your browser settings to be asked again, or write to [EMAIL] and we will action it for you.',
          ],
        },
      ],
    },
  },
  es: {
    privacy: {
      title: 'Política de privacidad',
      updated: 'Última actualización [FECHA]',
      sections: [
        {
          heading: 'Responsable del tratamiento',
          body: [
            'Responsable: [NOMBRE LEGAL COMPLETO], [NIF], [DOMICILIO SOCIAL]. Contacto: [EMAIL].',
            'Puedes dirigirte a [EMAIL] para cualquier cuestión relativa a esta política.',
          ],
        },
        {
          heading: 'Qué datos recogemos y para qué',
          body: [
            'Al enviar el formulario recogemos tu nombre, email, teléfono y el interés que nos indiques. Los usamos únicamente para responder a tu consulta y, si lo has consentido, para contactarte sobre propiedades y servicios.',
            'Base jurídica: tu consentimiento explícito (art. 6.1.a RGPD), prestado al marcar la casilla del formulario. Puedes retirarlo en cualquier momento, sin que ello afecte a la licitud del tratamiento previo.',
          ],
        },
        {
          heading: 'Medición publicitaria',
          body: [
            'Si aceptas las cookies publicitarias cargamos el Meta Pixel y enviamos eventos de conversión a Meta Platforms Ireland Ltd mediante la Conversions API, incluyendo tu email y teléfono en forma cifrada (SHA-256). Esto nos permite medir qué anuncios generan consultas.',
            'Esto implica una comunicación de datos a Meta, que puede tratarlos fuera del EEE al amparo del Marco de Privacidad de Datos UE-EE. UU. y de cláusulas contractuales tipo. Si rechazas las cookies publicitarias, no se carga ningún píxel.',
          ],
        },
        {
          heading: 'Plazo de conservación',
          body: [
            'Conservamos los datos de la consulta durante [PLAZO, p. ej. 24 meses] desde el último contacto, o hasta que solicites su supresión, si esto ocurre antes.',
          ],
        },
        {
          heading: 'Destinatarios',
          body: [
            'Tus datos no se venden ni se ceden a otras agencias inmobiliarias. Solo se comparten con: [PROVEEDOR DE HOSTING - Vercel Inc.], [CRM / PROVEEDOR DE EMAIL] y Meta para la medición publicitaria descrita.',
          ],
        },
        {
          heading: 'Tus derechos',
          body: [
            'Tienes derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad. Escribe a [EMAIL] y responderemos en el plazo de un mes.',
            'También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).',
          ],
        },
      ],
    },
    cookies: {
      title: 'Política de cookies',
      updated: 'Última actualización [FECHA]',
      sections: [
        {
          heading: 'Qué utilizamos',
          body: [
            'Estrictamente necesarias: una única entrada de almacenamiento local (jana.consent.v1) que recuerda tu elección sobre cookies. No requiere consentimiento y nunca sale de tu navegador.',
            'Medición publicitaria (requiere consentimiento): el Meta Pixel instala _fbp y, si llegas desde un anuncio de Meta, _fbc. Identifican tu navegador ante Meta para poder atribuir las consultas al anuncio que las generó. Conservación: hasta 90 días.',
          ],
        },
        {
          heading: 'Nada se carga antes de que elijas',
          body: [
            'No se solicita ningún script publicitario hasta que aceptas. Si rechazas, la web sigue funcionando con normalidad: simplemente no podremos saber qué anuncio te trajo hasta aquí.',
          ],
        },
        {
          heading: 'Cambiar de opinión',
          body: [
            'Borra los datos de este sitio en tu navegador para que volvamos a preguntarte, o escribe a [EMAIL] y lo gestionamos por ti.',
          ],
        },
      ],
    },
  },
}
