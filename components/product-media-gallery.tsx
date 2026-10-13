'use client'

import Image from 'next/image'
import { useState } from 'react'

type ProductMediaGalleryProps = {
  gallery: string[]
  productName: string
}

export function ProductMediaGallery({ gallery, productName }: ProductMediaGalleryProps) {
  const images = [...new Set(gallery.filter(Boolean))]
  const [selected, setSelected] = useState(0)
  const activeImage = images[selected] || images[0]

  if (!activeImage) return null

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        <Image
          src={activeImage}
          alt={`${productName} product image ${selected + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain p-5 sm:p-8"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              aria-label={`Show ${productName} image ${index + 1}`}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
              className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${selected === index ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}
            >
              <Image src={image} alt="" fill sizes="160px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
