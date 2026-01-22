"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface HorizontalGalleryProps {
  id: string
  title: string
  year: string
  images: string[]
  description?: string
  videoEmbed?: string
}

export function HorizontalGallery({ id, title, year, images, description, videoEmbed }: HorizontalGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const iframeRefs = useRef<Map<number, HTMLIFrameElement>>(new Map())
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set([0, 1, 2])) // First 3 instances autoplay

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const hasDragged = useRef(false)
  const lastX = useRef(0)
  const velocity = useRef(0)
  const momentumId = useRef<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages(prev => new Set(prev).add(src))
  }, [])

  // Filter only images for lightbox (exclude videos)
  const lightboxImages = images.filter(src => !src.toLowerCase().endsWith(".mp4") && !src.includes("youtube.com"))

  // Combine video embed (if exists) with images, then triplicate for seamless infinite loop
  const allMedia = videoEmbed ? [videoEmbed, ...images] : images
  const loopedMedia = [...allMedia, ...allMedia, ...allMedia]

  const getYouTubeVideoId = (url: string) => {
    const baseUrl = url.split("?")[0]
    return baseUrl.split("/embed/")[1]
  }

  const getCleanVideoUrl = (url: string) => {
    const baseUrl = url.split("?")[0]
    const videoId = getYouTubeVideoId(url)
    // Hide all YouTube branding and UI, loop video
    return `${baseUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&enablejsapi=1&fs=0&cc_load_policy=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url)
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const toggleVideoPlayPause = useCallback((index: number) => {
    const iframe = iframeRefs.current.get(index)
    if (!iframe?.contentWindow) return

    const isCurrentlyPlaying = playingVideos.has(index)

    if (isCurrentlyPlaying) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
      setPlayingVideos(prev => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    } else {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
      setPlayingVideos(prev => new Set(prev).add(index))
    }
  }, [playingVideos])

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    // Initial check must happen AFTER layout paints, otherwise scrollWidth can be wrong.
    const raf = requestAnimationFrame(checkScroll)

    container.addEventListener("scroll", checkScroll, { passive: true })
    window.addEventListener("resize", checkScroll)

    return () => {
      cancelAnimationFrame(raf)
      container.removeEventListener("scroll", checkScroll as any)
      window.removeEventListener("resize", checkScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasInitialized = useRef(false)

  // Set initial scroll position - wait for content to be ready
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const setInitialPosition = () => {
      const oneThird = container.scrollWidth / 3
      const offset = container.clientWidth * 0.08
      container.scrollLeft = oneThird - offset
      hasInitialized.current = true
    }

    // Set position multiple times to handle image loading
    const timeouts = [100, 300, 600, 1000].map(delay =>
      setTimeout(setInitialPosition, delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Auto-scroll effect with infinite loop (continues from current position)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || isHovering || lightboxOpen || isDragging || !hasInitialized.current) return

    const scrollSpeed = 0.3 // pixels per frame
    let animationId: number
    let isScrolling = true

    const autoScroll = () => {
      if (!container || !isScrolling) return

      const oneThird = container.scrollWidth / 3

      // When we've scrolled past the middle section, reset to first third
      if (container.scrollLeft >= oneThird * 2) {
        container.scrollLeft = container.scrollLeft - oneThird
      } else {
        container.scrollLeft += scrollSpeed
      }
      checkScroll()

      animationId = requestAnimationFrame(autoScroll)
    }

    // Resume auto-scroll from current position
    animationId = requestAnimationFrame(autoScroll)

    return () => {
      isScrolling = false
      cancelAnimationFrame(animationId)
    }
  }, [isHovering, lightboxOpen, isDragging])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current
    if (!container) return

    // Cancel any ongoing momentum
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current)
      momentumId.current = null
    }

    setIsDragging(true)
    hasDragged.current = false
    setStartX(e.pageX - container.offsetLeft)
    setScrollLeftStart(container.scrollLeft)
    lastX.current = e.pageX
    velocity.current = 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const container = scrollContainerRef.current
    if (!container) return

    e.preventDefault()
    const x = e.pageX - container.offsetLeft
    const walk = (x - startX) * 2 // Smooth multiplier

    // Track velocity for momentum
    velocity.current = lastX.current - e.pageX
    lastX.current = e.pageX

    // Mark as dragged if moved more than 5 pixels
    if (Math.abs(x - startX) > 5) {
      hasDragged.current = true
    }

    let newScrollLeft = scrollLeftStart - walk
    const oneThird = container.scrollWidth / 3

    // Infinite loop handling during drag
    if (newScrollLeft >= oneThird * 2) {
      newScrollLeft = newScrollLeft - oneThird
      setScrollLeftStart(scrollLeftStart - oneThird)
    } else if (newScrollLeft < oneThird * 0.1) {
      newScrollLeft = newScrollLeft + oneThird
      setScrollLeftStart(scrollLeftStart + oneThird)
    }

    container.scrollLeft = newScrollLeft
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    const container = scrollContainerRef.current
    if (!container || Math.abs(velocity.current) < 0.3) return

    // Apply momentum scrolling with smooth deceleration
    const applyMomentum = () => {
      if (Math.abs(velocity.current) < 0.3) {
        momentumId.current = null
        return
      }

      const oneThird = container.scrollWidth / 3
      let newScrollLeft = container.scrollLeft + velocity.current

      // Infinite loop handling during momentum
      if (newScrollLeft >= oneThird * 2) {
        newScrollLeft = newScrollLeft - oneThird
      } else if (newScrollLeft < oneThird * 0.1) {
        newScrollLeft = newScrollLeft + oneThird
      }

      container.scrollLeft = newScrollLeft
      velocity.current *= 0.96 // Slower deceleration for smoother glide

      momentumId.current = requestAnimationFrame(applyMomentum)
    }

    momentumId.current = requestAnimationFrame(applyMomentum)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp() // Apply momentum when leaving while dragging
    }
    setIsDragging(false)
  }

  const openLightbox = (imageSrc: string) => {
    const index = lightboxImages.indexOf(imageSrc)
    if (index !== -1) {
      setLightboxIndex(index)
      setLightboxOpen(true)
    }
  }

  const closeLightbox = () => setLightboxOpen(false)

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1))
  }

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
  }, [lightboxOpen, lightboxImages.length])

  return (
    <section id={id} className="mb-20 md:mb-32 scroll-mt-24">
      {/* Header */}
      <div className="px-6 md:px-12 border-card-foreground border-b mb-3 py-2">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <h2 className="text-sm font-medium text-foreground">{title}</h2>
            <span className="text-sm text-muted-foreground">{year}</span>
          </div>
          {description && (
            <button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border rounded-full px-3 py-1"
            >
              {showDescription ? "Hide Info" : "Info"}
            </button>
          )}
        </div>

        {description && showDescription && (
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>

      {/* Gallery */}
      <div className="relative group">
        {/* Left scroll button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right scroll button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className={`flex items-stretch overflow-x-auto scrollbar-hide px-6 md:px-12 h-[280px] md:h-[360px] lg:h-[420px] gap-3 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => { setIsHovering(false); handleMouseLeave(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* All media (YouTube, mp4s, images) in infinite loop */}
          {loopedMedia.map((src, index) => {
            const isYouTube = src.includes("youtube.com")
            const isMp4 = src.toLowerCase().endsWith(".mp4")
            const originalIndex = index % allMedia.length
            const isFirstVisible = index < 3
            const isLoaded = loadedImages.has(src)
            // Only render actual iframe for middle section to avoid lag (indexes allMedia.length to allMedia.length*2)
            const isMiddleSection = index >= allMedia.length && index < allMedia.length * 2
            const shouldRenderIframe = isYouTube && isMiddleSection

            return (
              <div
                key={`${src}-${index}`}
                className={`flex-shrink-0 relative h-full rounded-sm overflow-hidden bg-muted ${(isYouTube || isMp4) ? 'aspect-video' : ''}`}
              >
                {isYouTube ? (
                  shouldRenderIframe ? (
                    <>
                      <iframe
                        ref={(el) => { if (el) iframeRefs.current.set(index, el) }}
                        src={getCleanVideoUrl(src)}
                        title={`${title} video`}
                        className="w-full h-full pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                      <button
                        type="button"
                        onClick={() => { if (!hasDragged.current) toggleVideoPlayPause(index) }}
                        className="absolute inset-0 flex items-center justify-center group/playpause"
                        aria-label={playingVideos.has(index) ? "Pause video" : "Play video"}
                      >
                        <div className="opacity-0 group-hover/playpause:opacity-100 transition-opacity drop-shadow-lg">
                          {playingVideos.has(index) ? (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                          ) : (
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </>
                  ) : (
                    // Thumbnail placeholder for non-middle YouTube instances
                    <Image
                      src={getYouTubeThumbnail(src)}
                      alt={`${title} video thumbnail`}
                      fill
                      className="object-cover"
                    />
                  )
                ) : isMp4 ? (
                  <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                    <source src={src} type="video/mp4" />
                  </video>
                ) : (
                  <>
                    {!isLoaded && (
                      <Skeleton className="absolute inset-0 z-10" />
                    )}
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`${title} project image ${originalIndex + 1}`}
                      width={600}
                      height={420}
                      className={`h-full w-auto object-contain cursor-pointer select-none transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
                      priority={isFirstVisible}
                      loading={isFirstVisible ? undefined : 'lazy'}
                      draggable={false}
                      onLoad={() => handleImageLoad(src)}
                      onClick={() => { if (!hasDragged.current) openLightbox(src) }}
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
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
          {lightboxImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToPrevious() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {lightboxImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goToNext() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImages[lightboxIndex] || "/placeholder.svg"}
              alt={`${title} project image ${lightboxIndex + 1}`}
              width={1600}
              height={1200}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
          </div>

          {/* Image counter */}
          {lightboxImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {lightboxIndex + 1} / {lightboxImages.length}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
