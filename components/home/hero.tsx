import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { FilamentPath } from "@/components/filament-path"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-composite-landscape.png"
          alt="PLA Basic filament spool and 3D-printed samples in front of the Shuzhihai extrusion line"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover sm:block"
        />
        <Image
          src="/images/hero-composite-portrait.png"
          alt="PLA Basic filament spool and 3D-printed sample in front of the Shuzhihai extrusion line"
          fill
          priority
          sizes="100vw"
          className="block object-cover object-center sm:hidden"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/95 via-white/82 to-transparent sm:bg-gradient-to-r sm:from-white/92 sm:via-white/62 sm:to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <FilamentPath variant="desktop" />
        <FilamentPath variant="mobile" />
      </div>

      <div className="relative mx-auto flex min-h-[612px] max-w-7xl flex-col justify-start px-4 pb-10 pt-16 sm:min-h-[620px] sm:justify-center sm:px-6 sm:py-20 lg:min-h-[720px] lg:px-8">
        <div className="max-w-xl">
          <Reveal>
            <span className="inline-flex items-center rounded-full bg-primary/8 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
              Filament &amp; color-masterbatch manufacturer
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-4 max-w-[22rem] text-[2.35rem] font-semibold leading-[1.03] tracking-tight text-foreground sm:mt-5 sm:max-w-xl sm:text-5xl lg:text-6xl">
              PLA Basic filament, produced for consistent, repeatable prints
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-4 max-w-[21rem] text-sm leading-relaxed text-foreground/75 sm:mt-5 sm:max-w-lg sm:text-lg">
              Ningbo Shuzhihai New Materials manufactures PLA Basic 3D printer filament in 19 colors, backed by
              in-house color-masterbatch modification and OEM/ODM support for distributors, cross-border sellers,
              makers, education, and industrial buyers.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <Button asChild size="lg" className="gap-2">
                <Link href="/contact">
                  Request a quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/30 bg-white/75 text-primary backdrop-blur-sm hover:bg-white hover:text-primary">
                <Link href="/products/pla-basic">View PLA Basic</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
