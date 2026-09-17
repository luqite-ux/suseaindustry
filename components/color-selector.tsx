"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FilamentColor } from "@/lib/colors"

function FadeImage({ src, alt }: { src: string; alt: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [src])

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 480px, 90vw"
      className={cn("motion-fade object-contain p-6 transition-opacity duration-200", visible ? "opacity-100" : "opacity-0")}
    />
  )
}

export function ColorSelector({
  colors,
  className,
  initialSlug,
}: {
  colors: FilamentColor[]
  className?: string
  initialSlug?: string
}) {
  const [selected, setSelected] = useState(() => colors.find((c) => c.slug === initialSlug) ?? colors[0])
  const image = selected.photo

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-10", className)}>
      <div className="relative order-1 aspect-square w-full overflow-hidden rounded-2xl bg-secondary/60 lg:order-2">
        {image ? (
          <FadeImage src={image} alt={`PLA Basic filament, ${selected.name} color`} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
            <span
              aria-hidden
              className="size-28 rounded-full shadow-inner ring-1 ring-black/5"
              style={{ backgroundColor: selected.swatch }}
            />
            <p className="text-sm text-muted-foreground">
              PLA Basic — {selected.name}
              <span className="block text-xs">Product photography available upon request</span>
            </p>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm">
          {selected.name}
        </span>
      </div>

      <div className="order-2 lg:order-1">
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          19 colors, one consistent PLA Basic formulation
        </p>
        <div className="-mx-1 flex gap-2.5 overflow-x-auto pb-2 pl-1 lg:flex-wrap lg:overflow-visible" role="listbox" aria-label="Filament colors">
          {colors.map((color) => {
            const active = color.slug === selected.slug
            return (
              <button
                key={color.slug}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => setSelected(color)}
                className={cn(
                  "group flex shrink-0 flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active ? "bg-secondary" : "hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full ring-1 ring-black/10 transition-transform duration-150",
                    active && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: color.swatch }}
                >
                  {active && <Check className="size-4 text-white drop-shadow" strokeWidth={3} />}
                </span>
                <span className="max-w-16 truncate text-[11px] text-muted-foreground group-hover:text-foreground">
                  {color.name}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Every color runs through the same PLA Basic material specification, so switching SKUs does not mean
          switching print behavior. Custom colors and OEM labeling are available — see{" "}
          <a href="/capabilities" className="font-medium text-primary underline-offset-4 hover:underline">
            Capabilities
          </a>
          .
        </p>
      </div>
    </div>
  )
}
