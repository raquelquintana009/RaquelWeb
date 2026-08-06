"use client"

import { useEffect, useRef, useState } from "react"

// Full-bleed Liminal Breath background video for the Home section.
// Self-hosted (muted, looping) so there is no player UI — no play/pause
// button, no title overlay. A static poster layer sits *behind* the video
// so any buffer/decode/loop hitch reveals the still frame instead of a
// black flash, and the video fades in as soon as its first frame is ready.
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)

  // React doesn't reliably set the `muted` DOM property before the browser's
  // autoplay check, which can block playback. Force muted, then attempt play
  // aggressively and keep a fallback path so it can never end up stuck paused.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.defaultMuted = true

    const tryPlay = () => {
      const p = video.play()
      if (p && typeof p.catch === "function") p.catch(() => {})
    }
    tryPlay()

    // Retry as the media becomes ready, in case the first attempt was early.
    video.addEventListener("loadedmetadata", tryPlay)
    video.addEventListener("canplay", tryPlay)

    // If autoplay is blocked (iOS Low Power Mode, data saver, background tab),
    // start on the first user interaction or when the tab becomes visible.
    const kick = () => tryPlay()
    const onVisible = () => { if (!document.hidden) tryPlay() }
    window.addEventListener("pointerdown", kick, { passive: true })
    window.addEventListener("touchstart", kick, { passive: true })
    window.addEventListener("keydown", kick)
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay)
      video.removeEventListener("canplay", tryPlay)
      window.removeEventListener("pointerdown", kick)
      window.removeEventListener("touchstart", kick)
      window.removeEventListener("keydown", kick)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* Poster still sits behind the video and never moves, so a buffer,
          decode, or loop-restart hitch shows this frame instead of black. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/liminal-breath-poster.jpg)" }}
      />

      <video
        ref={videoRef}
        // transform-gpu + hidden backface promote the video to its own GPU
        // layer, which stops the compositing repaint flicker under the
        // overlay. Opacity fades the video in over the poster (no hard swap).
        className="absolute inset-0 h-full w-full object-cover transform-gpu transition-opacity duration-700 ease-out"
        style={{ opacity: visible ? 1 : 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/liminal-breath-poster.jpg"
        // Reveal as soon as the first frame is decoded OR playback starts, so
        // the video is never stuck hidden behind the poster if autoplay stalls.
        onLoadedData={() => setVisible(true)}
        onPlaying={() => setVisible(true)}
      >
        <source src="/liminal-breath.mp4" type="video/mp4" />
      </video>

      {/* Subtle gradient so overlaid white text stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Bottom tagline */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10 md:pb-14 text-center">
        <p className="text-white text-[31px] font-medium">Designing experiences across scales</p>
      </div>
    </section>
  )
}
