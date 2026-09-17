import type { Metadata } from "next"
import Image from "next/image"
import { Reveal, RevealGroup } from "@/components/reveal"
import { QuoteCta } from "@/components/quote-cta"

export const metadata: Metadata = {
  title: "About",
  description: "About Ningbo Shuzhihai New Materials Co., Ltd., a PLA Basic 3D printer filament manufacturer.",
}

const values = [
  {
    title: "Material consistency",
    description: "Every color runs on the same PLA Basic formulation and dimensional control process.",
  },
  {
    title: "Buyer flexibility",
    description: "Color development, OEM/ODM, and packaging customization are handled directly with each order.",
  },
  {
    title: "Direct communication",
    description: "Volumes, specifications, and lead times are confirmed with buyers before production starts.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <Reveal>
              <span className="text-sm font-medium text-primary">About us</span>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Ningbo Shuzhihai New Materials Co., Ltd.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                Based in Ningbo, Zhejiang, we manufacture PLA Basic 3D printer filament and support buyers with
                color masterbatch modification, OEM/ODM production, and custom color and packaging solutions.
              </p>
            </Reveal>
            <Reveal delay={100} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
              <Image
                src="/images/factory-line-wide.jpg"
                alt="Wide view of the Shuzhihai New Materials production floor"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">What guides our work</h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold text-foreground">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Our production floor</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
              <Image
                src="/images/factory-line-closeup.jpg"
                alt="Close-up of filament spooling equipment"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={90} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
              <Image
                src="/images/factory-line-wide.jpg"
                alt="Wide view of the filament extrusion production line"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <QuoteCta />
    </>
  )
}
