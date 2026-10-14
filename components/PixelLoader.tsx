'use client'

import { useEffect, useRef } from 'react'
import { useConsent } from '@/lib/consent'
import { loadPixel, mirrorToCapi, newEventId, trackPixel } from '@/lib/pixel'

/**
 * Loads the Meta Pixel and fires PageView — but only once the visitor has
 * granted advertising consent. Nothing from Meta is requested before that,
 * which is what GDPR prior consent actually requires.
 */
export default function PixelLoader() {
  const { consent } = useConsent()
  const fired = useRef(false)

  useEffect(() => {
    if (!consent?.marketing || fired.current) return
    fired.current = true

    loadPixel()

    const eventId = newEventId()
    trackPixel('PageView', eventId)
    void mirrorToCapi({ eventName: 'PageView', eventId })
  }, [consent?.marketing])

  return null
}
