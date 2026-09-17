import Link from "next/link"
import { Palette, Factory, PackageSearch, ArrowRight } from "lucide-react"
import { Reveal, RevealGroup } from "@/components/reveal"

const capabilities = [
  {
    icon: Palette,
    title: "Color masterbatch modification",
    description:
      "In-house color development and masterbatch modification for the PLA Basic line, so buyers can match a target shade instead of choosing from a fixed catalog only.",
  },
  {
    icon: Factory,
    title: "OEM / ODM manufacturing",
    description:
      "Private-label production for distributors and cross-border sellers who need their own brand on a proven PLA Basic formulation.",
  },
  {
    icon: PackageSearch,
    title: "Custom color & packaging",
    description:
      "Spool labeling, box art, and packaging formats can be adapted to a buyer's brand and target market once requirements are confirmed at quote stage.",
  },
]

export function CapabilitiesPreview() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-sm font-medium text-primary">Materials &amp; customization</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Built for buyers who need more than a catalog SKU
              </h2>
            </div>
            <Link href="/capabilities" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              View all capabilities
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-3">
          {capabilities.map((cap) => (
            <div key={cap.title} className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <cap.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{cap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cap.description}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
