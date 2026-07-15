"use client"

// Full-bleed Liminal Breath background video for the Home section.
// Uses the same YouTube source as the Liminal Breath project, scaled to cover
// the viewport (no letterboxing) with all branding/controls hidden.
export function HeroVideo() {
  const videoId = "z5wdWnmcaOI"
  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&fs=0`

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* Cover video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={src}
          title="Liminal Breath"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "100vw", height: "56.25vw", minHeight: "100svh", minWidth: "177.78svh" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Subtle gradient so overlaid white text stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      {/* Bottom tagline */}
      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10 md:pb-14 text-center">
        <p className="text-white text-[31px] font-medium">
          Designing experiences across scales
        </p>
      </div>
    </section>
  )
}
