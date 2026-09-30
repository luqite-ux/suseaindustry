"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { selectColorVariant } from "@/lib/color-variant-preview.mjs"

export type ProductColorVariant = {
  slug: string
  name: string
  swatch: string
  productImage: string
  sampleImage: string
}

type ProductColorVariantsProps = {
  productName: string
  category: string
  overview: string
  specs: [string, string][]
  variants: ProductColorVariant[]
}

export function ProductColorVariants({ productName, category, overview, specs, variants }: ProductColorVariantsProps) {
  const [selectedSlug, setSelectedSlug] = useState(variants[0]?.slug ?? "")
  const sampleRef = useRef<HTMLDivElement>(null)
  const selected = selectColorVariant(variants, selectedSlug)

  if (!selected) return null

  return (
    <div>
      <div className="mb-7">
        <span className="text-sm font-medium text-primary">{category}</span>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{productName}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{overview}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2" aria-live="polite">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white">
          <Image key={selected.productImage} src={selected.productImage} alt={`${productName} in ${selected.name}`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-2 sm:p-3" />
        </div>
        <div ref={sampleRef} className="relative aspect-square scroll-mt-20 overflow-hidden rounded-2xl border border-border bg-white">
          <Image key={selected.sampleImage} src={selected.sampleImage} alt={`${selected.name} PLA Basic printed horse sample`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-2 sm:p-3" />
        </div>
      </div>

      <section className="mt-9" aria-labelledby="color-choice-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="color-choice-heading" className="text-2xl font-semibold tracking-tight text-foreground">Choose a color</h2>
            <p className="mt-1 text-sm text-muted-foreground">Selected: <span className="font-medium text-foreground">{selected.name}</span></p>
          </div>
          <p className="text-sm text-muted-foreground">19 available colors</p>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-10" role="listbox" aria-label="PLA Basic colors">
          {variants.map((variant) => {
            const active = variant.slug === selected.slug
            return (
              <button
                key={variant.slug}
                type="button"
                role="option"
                aria-selected={active}
                aria-label={`Show ${variant.name}`}
                onClick={() => {
                  setSelectedSlug(variant.slug)
                  requestAnimationFrame(() => sampleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
                }}
                className={cn("group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border bg-card px-1 py-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}
              >
                <span className={cn("relative flex size-9 items-center justify-center rounded-full border border-black/10", active && "ring-2 ring-primary ring-offset-2 ring-offset-background")} style={{ backgroundColor: variant.swatch }}>
                  {active && <Check className="size-4 text-white drop-shadow" strokeWidth={3} />}
                </span>
                <span className="w-full truncate text-[10px] font-medium text-muted-foreground group-hover:text-foreground sm:text-[11px]">{variant.name}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="mt-9" aria-labelledby="specifications-heading">
        <h2 id="specifications-heading" className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Specifications</h2>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {specs.map(([key, value]) => (
            <div key={key} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{key}</dt>
              <dd className="mt-1 font-semibold text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
