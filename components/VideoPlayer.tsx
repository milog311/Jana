'use client'

import { useEffect, useRef } from 'react'
import { isHls } from '@/lib/video'

/**
 * Plays a film in a plain <video>, so the player is ours to style rather than
 * an iframe we can't reach into.
 *
 * A plain .mp4 (R2) just plays. An HLS manifest (Stream) plays natively in
 * Safari — and on iOS, where every browser is Safari underneath — but needs
 * hls.js everywhere else. That import is dynamic and only happens for HLS, so
 * its ~130 KB never reaches a visitor watching an MP4, or one who opens no
 * film at all.
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

    /*
     * Play explicitly rather than relying on the autoPlay attribute. With HLS
     * the source attaches asynchronously, well after the attribute has been
     * evaluated against an empty <video>, so the attribute alone silently
     * does nothing. A rejected play() is fine and expected — browsers block
     * unmuted autoplay without user activation — and the controls are already
     * on screen, so the viewer just presses play.
     */
    const start = () => {
      if (!autoPlay) return
      video.play().catch(() => {})
    }

    // Progressive MP4: nothing to negotiate.
    if (!isHls(src)) {
      video.src = src
      start()
      return
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      start()
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
          start()
          return
        }
        const instance = new Hls({ enableWorker: true })
        hls = instance
        instance.loadSource(src)
        instance.attachMedia(video)
        instance.on(Hls.Events.MANIFEST_PARSED, start)
      })
      .catch(() => {
        if (destroyed) return
        video.src = src
        start()
      })

    return () => {
      destroyed = true
      hls?.destroy()
    }
  }, [src, autoPlay])

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
