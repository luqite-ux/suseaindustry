import type { Metadata } from "next"
import Image from "next/image"
import { Palette, Factory, PackageSearch, FlaskConical, ClipboardCheck, Truck } from "lucide-react"
import { Reveal, RevealGroup } from "@/components/reveal"
import { QuoteCta } from "@/components/quote-cta"

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Color masterbatch modification, OEM/ODM manufacturing, and custom color and packaging capabilities from Ningbo Shuzhihai New Materials.",
}

const capabilities = [
  {
    icon: FlaskConical,
    title: "Color masterbatch modification",
    description:
      "Masterbatch is developed and modified in-house against a target shade or reference sample, then run into the PLA Basic formulation so color performance stays consistent batch to batch.",
  },
  {
    icon: Palette,
    title: "Custom color development",
    description:
      "Beyond the standard 19-color range, new colors can be developed for buyers with catalog-specific or brand-specific requirements. Feasibility and lead time are confirmed once a target reference is shared.",
  },
  {
    icon: Factory,
    title: "OEM / ODM manufacturing",
    description:
      "Private-label production on the PLA Basic line for distributors and cross-border sellers who want their own brand on the spool without building their own extrusion capability.",
  },
  {
    icon: PackageSearch,
    title: "Custom packaging & labeling",
    description:
      "Spool labels, box graphics, and outer carton formats can be adapted for a buyer's brand and target market. Packaging options and minimums are confirmed at quote stage.",
  },
  {
    icon: ClipboardCheck,
    title: "Quality & dimensional control",
    description:
      "Filament diameter is held to ±0.02mm accuracy on the production line, supporting clog-free extrusion across long print runs.",
  },
  {
    icon: Truck,
    title: "Order & logistics support",
    description:
      "Volume, packaging format, and shipping details are confirmed directly with each buyer once a quote request is submitted.",
  },
]

export default function CapabilitiesPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-sm font-medium text-primary">Capabilities</span>
            <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Material and manufacturing capabilities
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Beyond stocking a fixed color range, our team supports color development, private-label production,
              and packaging customization built around the PLA Basic material.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <div key={cap.title} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <cap.icon className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-foreground">{cap.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-sm font-medium text-primary">On the production floor</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Modification and extrusion happen on the same line
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Color masterbatch is introduced upstream of extrusion, so a custom shade moves through the same
                dimensional control process as every standard PLA Basic color.
              </p>
            </Reveal>
            <Reveal delay={100} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary/40">
              <Image
                src="/images/factory-line-closeup.jpg"
                alt="Close-up of the filament production line where color masterbatch is introduced"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <QuoteCta
        title="Have a color reference or brand spec to share?"
        description="Send your requirements through the quote form and we'll confirm feasibility, lead time, and next steps."
      />
    </>
  )
}
