"use client"

import { useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function ProductColorVariants({
  productName,
  category,
  overview,
  specs,
  variants,
}: ProductColorVariantsProps) {
  const [selectedSlug, setSelectedSlug] = useState(variants[0]?.slug ?? "")
  const selected = variants.find((variant) => variant.slug === selectedSlug) ?? variants[0]

  if (!selected) return null

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white">
          <Image
            key={selected.productImage}
            src={selected.productImage}
            alt={`${productName} in ${selected.name}`}
            fill
            priority
            sizes="(min-width:1024px) 560px, 100vw"
            className="object-contain p-3 sm:p-5"
          />
          <span className="absolute left-4 top-4 rounded-full border border-border bg-white/95 px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
            {selected.name}
          </span>
        </div>

        <div>
          <span className="text-sm font-medium text-primary">{category}</span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{productName}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{overview}</p>

          <div className="mt-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Color</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{selected.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">19 available colors</p>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-5" role="listbox" aria-label="PLA Basic colors">
              {variants.map((variant) => {
                const active = variant.slug === selected.slug
                return (
                  <button
                    key={variant.slug}
                    type="button"
                    role="option"
                    aria-selected={active}
                    aria-label={`Show ${variant.name}`}
                    onClick={() => setSelectedSlug(variant.slug)}
                    className={cn(
                      "group flex min-w-0 flex-col items-center gap-1.5 rounded-xl border bg-card px-1 py-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex size-9 items-center justify-center rounded-full border border-black/10",
                        active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                      )}
                      style={{ backgroundColor: variant.swatch }}
                    >
                      {active && <Check className="size-4 text-white drop-shadow" strokeWidth={3} />}
                    </span>
                    <span className="w-full truncate text-[10px] font-medium text-muted-foreground group-hover:text-foreground sm:text-[11px]">
                      {variant.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <dl className="mt-7 grid gap-3 sm:grid-cols-2">
            {specs.map(([key, value]) => (
              <div key={key} className="rounded-xl border border-border bg-card p-4">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">{key}</dt>
                <dd className="mt-1 font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-14 border-t border-border pt-10" aria-labelledby="printed-sample-heading">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <span className="text-sm font-medium text-primary">Printed color sample</span>
            <h2 id="printed-sample-heading" className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {selected.name} in a finished print
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              The sample below corresponds to the selected filament color, so the spool and printed result stay paired.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-white sm:aspect-[4/3]">
            <Image
              key={selected.sampleImage}
              src={selected.sampleImage}
              alt={`${selected.name} PLA Basic printed horse sample`}
              fill
              sizes="(min-width:1024px) 700px, 100vw"
              className="object-contain p-4 sm:p-6"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
