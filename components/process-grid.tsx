"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// Process model photos (from /public/Process Models).
const processImages = [
  "/Process Models/200_Edge1.JPG",
  "/Process Models/201_Edge2.jpg",
  "/Process Models/202_Edge3.jpg",
  "/Process Models/210_Flourish1.jpg",
  "/Process Models/211_Flourish2.jpg",
  "/Process Models/212_Flourish3.jpg",
  "/Process Models/220_Horizon1.jpg",
  "/Process Models/221_Horizon2.jpg",
  "/Process Models/222_Horizon3.jpg",
  "/Process Models/230_Infinite1.jpeg",
  "/Process Models/231_Infinite2.jpg",
  "/Process Models/231_Thesis1.jpg",
]

export function ProcessGrid() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }
  const closeLightbox = () => setLightboxOpen(false)
  const goToPrevious = () =>
    setLightboxIndex((prev) => (prev === 0 ? processImages.length - 1 : prev - 1))
  const goToNext = () =>
    setLightboxIndex((prev) => (prev === processImages.length - 1 ? 0 : prev + 1))

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  return (
    <section id="process" className="w-full">
      {/* Header — same style as the project galleries */}
      <div className="px-6 md:px-12 border-card-foreground border-b mb-3 py-2">
        <h2 className="text-sm font-medium text-foreground">Process</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
          Design begins through making. Physical models, diagrams, and iterative studies are used to explore material,
          narrative, movement, and time.
        </p>
      </div>

      {/* Grid — click any photo to open it larger */}
      <div className="grid w-full grid-cols-3 gap-2 bg-background px-6 md:px-12 pb-6">
        {processImages.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => openLightbox(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted cursor-pointer"
            aria-label={`Open process model ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Process model ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal — matches the project galleries */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={processImages[lightboxIndex]}
              alt={`Process model ${lightboxIndex + 1}`}
              width={1600}
              height={1200}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxIndex + 1} / {processImages.length}
          </div>
        </div>
      )}
    </section>
  )
}
