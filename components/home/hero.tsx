"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  { image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/banners/20260930/2efc3be51a69cb9b-filament-range.jpg", eyebrow: "PLA Basic in 19 production colors", title: "One consistent filament, a complete color range", description: "PLA Basic 1.75 mm filament for distributors, cross-border sellers, education, makers, and industrial buyers.", primary: { href: "/products/pla-basic", label: "Explore all 19 colors" }, secondary: { href: "/contact", label: "Request a quote" } },
  { image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/banners/20260930/4261234ff2640766-color-development.jpg", eyebrow: "Color-masterbatch development", title: "Color options built for catalog-ready product lines", description: "Choose from the current PLA Basic range or discuss color matching and OEM labeling for your market.", primary: { href: "/capabilities", label: "View capabilities" }, secondary: { href: "/products/pla-basic", label: "See the color range" } },
  { image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/banners/20260930/401005d7000033de-production-process.jpg", eyebrow: "Production and OEM support", title: "From material preparation to finished filament", description: "Discuss target colors, packaging, order volume, and application requirements with our export team.", primary: { href: "/contact", label: "Start an inquiry" }, secondary: { href: "/about", label: "About Shuzhihai" } },
] as const

export function Hero() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      6500,
    )
    return () => window.clearInterval(timer)
  }, [])
  const slide = slides[active]
  const move = (direction: -1 | 1) => setActive((current) => (current + direction + slides.length) % slides.length)

  return (
    <section className="relative overflow-hidden border-b border-border bg-white" aria-roledescription="carousel" aria-label="Shuzhihai highlights">
      <div className="relative aspect-[16/10] w-full bg-slate-100 sm:absolute sm:inset-0 sm:aspect-auto">
        {slides.map((item, index) => <Image key={item.image} src={item.image} alt="" fill priority={index === 0} sizes="100vw" className={cn("object-cover object-center transition-opacity duration-700", index === active ? "opacity-100" : "pointer-events-none opacity-0")} />)}
      </div>
      <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-white via-white/88 to-white/5 sm:block" />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-20 pt-8 sm:min-h-[620px] sm:px-6 sm:py-20 lg:min-h-[720px] lg:px-8">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">{slide.eyebrow}</span>
          <h1 className="mt-4 max-w-[24rem] text-[2.35rem] font-semibold leading-[1.03] tracking-tight text-foreground sm:mt-5 sm:max-w-xl sm:text-5xl lg:text-6xl">{slide.title}</h1>
          <p className="mt-4 max-w-[36rem] text-sm leading-relaxed text-foreground/75 sm:mt-5 sm:text-lg">{slide.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <Button asChild size="lg" className="gap-2"><Link href={slide.primary.href}>{slide.primary.label}<ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-primary/30 bg-white/85 text-primary hover:bg-white hover:text-primary"><Link href={slide.secondary.href}>{slide.secondary.label}</Link></Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-white/95 p-1.5 shadow-sm sm:bottom-7 sm:left-auto sm:right-8 sm:translate-x-0">
        <button type="button" onClick={() => move(-1)} aria-label="Previous banner" className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><ArrowLeft className="size-4" /></button>
        <div className="flex gap-1.5" aria-label={`Banner ${active + 1} of ${slides.length}`}>{slides.map((item, index) => <button key={item.image} type="button" onClick={() => setActive(index)} aria-label={`Show banner ${index + 1}`} aria-current={index === active ? "true" : undefined} className={cn("h-2 rounded-full transition-all", index === active ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/50")} />)}</div>
        <button type="button" onClick={() => move(1)} aria-label="Next banner" className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><ArrowRight className="size-4" /></button>
      </div>
    </section>
  )
}
