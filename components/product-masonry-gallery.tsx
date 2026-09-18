"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { createGallerySession, getLockedBodyStyles, moveGallerySession } from "@/lib/masonry-gallery.mjs"

type GallerySession = { activeIndex: number; triggerIndex: number; openedAtScrollY: number }

type ProductMasonryGalleryProps = {
  images: string[]
  productName: string
  fallbackImage: string
}

export function ProductMasonryGallery({ images, productName, fallbackImage }: ProductMasonryGalleryProps) {
  const [session, setSession] = useState<GallerySession | null>(null)
  const [failedIndex, setFailedIndex] = useState<number | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = session !== null

  useEffect(() => {
    if (!isOpen || !session) return

    const body = document.body
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
      overflow: body.style.overflow,
    }
    const scrollY = session.openedAtScrollY
    const locked = getLockedBodyStyles(scrollY, window.innerWidth - document.documentElement.clientWidth)
    Object.assign(body.style, locked)
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSession(null)
        return
      }
      if (event.key === "ArrowLeft") {
        setSession((current) => current ? moveGallerySession(current, -1, images.length) : current)
        return
      }
      if (event.key === "ArrowRight") {
        setSession((current) => current ? moveGallerySession(current, 1, images.length) : current)
        return
      }
      if (event.key !== "Tab") return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])")
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      Object.assign(body.style, previous)
      window.scrollTo(0, scrollY)
      triggerRefs.current[session.triggerIndex]?.focus()
    }
  }, [isOpen, images.length])

  if (!images.length) return null

  const activeIndex = session?.activeIndex ?? null
  const activeImage = activeIndex === null ? null : images[activeIndex]

  return (
    <>
      <div className="columns-1 gap-4 md:columns-2 lg:columns-3" data-masonry-gallery>
        {images.map((src, index) => (
          <Reveal key={`${src}-${index}`} delay={(index % 3) * 80} className="mb-4 break-inside-avoid">
            <button
              ref={(node) => { triggerRefs.current[index] = node }}
              type="button"
              onClick={() => { setFailedIndex(null); setSession(createGallerySession(index, window.scrollY)) }}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-secondary/35 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Open image ${index + 1} of ${images.length} for ${productName}`}
            >
              <img
                src={src}
                alt={`${productName} source image ${index + 1}`}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" aria-hidden="true">
                <Expand className="size-4" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {activeImage && activeIndex !== null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image gallery`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
          onMouseDown={(event) => { if (event.target === event.currentTarget) setSession(null) }}
        >
          <button ref={closeRef} type="button" onClick={() => setSession(null)} className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400" aria-label="Close image viewer">
            <X className="size-5" />
          </button>
          <button type="button" onClick={() => { setFailedIndex(null); setSession((current) => current ? moveGallerySession(current, -1, images.length) : current) }} className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:left-6" aria-label="Previous image">
            <ChevronLeft className="size-6" />
          </button>
          <div className="flex h-full w-full items-center justify-center px-10 sm:px-16">
            {failedIndex === activeIndex ? (
              <div className="rounded-xl bg-white p-6 text-center text-slate-950">
                <p className="font-semibold">This image could not be loaded.</p>
                <button type="button" className="mt-3 text-sm font-medium text-primary underline" onClick={() => setFailedIndex(null)}>Try again</button>
              </div>
            ) : (
              <img src={activeImage} alt={`${productName} enlarged image ${activeIndex + 1}`} className="max-h-full max-w-full object-contain" onError={(event) => {
                const image = event.currentTarget
                if (image.src !== new URL(fallbackImage, window.location.href).href) image.src = fallbackImage
                else setFailedIndex(activeIndex)
              }} />
            )}
          </div>
          <button type="button" onClick={() => { setFailedIndex(null); setSession((current) => current ? moveGallerySession(current, 1, images.length) : current) }} className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-950 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:right-6" aria-label="Next image">
            <ChevronRight className="size-6" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/70 px-3 py-1 text-sm text-white" aria-live="polite">{activeIndex + 1} / {images.length}</p>
        </div>
      ) : null}
    </>
  )
}
