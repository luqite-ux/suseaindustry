import Image from "next/image"
import { Reveal } from "@/components/reveal"

export function FactorySection() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">Inside the plant</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A real production line in Ningbo
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Filament extrusion, spooling, and quality checks run on the same production floor shown below.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
            <Image
              src="/images/factory-line-wide.jpg"
              alt="Wide view of the Shuzhihai filament extrusion production line"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={90} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
            <Image
              src="/images/factory-line-closeup.jpg"
              alt="Close-up of filament spooling equipment on the production line"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
