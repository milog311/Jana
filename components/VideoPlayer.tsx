'use client'

import { useEffect, useRef } from 'react'

/**
 * Plays a Cloudflare Stream HLS manifest in a plain <video>, so the player is
 * ours to style rather than an iframe we can't reach into.
 *
 * Safari (and iOS, where every browser is Safari underneath) plays HLS
 * natively. Everywhere else needs hls.js, which is imported dynamically on
 * first play — it is far too heavy to sit in the initial bundle of a landing
 * page that may never open a film.
 */
export default function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = true,
  controls = true,
  muted = false,
  loop = false,
}: {
  src: string
  poster?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
  muted?: boolean
  loop?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl')
    if (nativeHls) {
      video.src = src
      return
    }

    let destroyed = false
    let hls: { destroy: () => void } | null = null

    import('hls.js')
      .then(({ default: Hls }) => {
        if (destroyed) return
        if (!Hls.isSupported()) {
          // Last resort: let the browser try the manifest itself.
          video.src = src
          return
        }
        const instance = new Hls({ enableWorker: true })
        hls = instance
        instance.loadSource(src)
        instance.attachMedia(video)
      })
      .catch(() => {
        if (!destroyed) video.src = src
      })

    return () => {
      destroyed = true
      hls?.destroy()
    }
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
    />
  )
}
