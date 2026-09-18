import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Reveal, RevealGroup } from "@/components/reveal"

const applications = [
  {
    title: "Distributors & resellers",
    description: "Multi-color PLA Basic stock built from one supply relationship instead of nineteen.",
    image: "/images/pla-basic-purple.png",
    imageAlt: "Purple PLA Basic filament retail presentation for distributor catalogs",
  },
  {
    title: "Cross-border sellers",
    description: "OEM labeling and packaging support for private-label filament listings.",
    image: "/images/pla-basic-metallic.png",
    imageAlt: "Metallic PLA Basic filament retail presentation for cross-border listings",
  },
  {
    title: "Makers & hobbyists",
    description: "Clean, pure colors with dimensionally accurate extrusion for everyday desktop printing.",
    image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/6c36e88e00b8049e-3.jpg",
    imageAlt: "Purple PLA Basic 3D-printed unicorn figurine sample",
  },
  {
    title: "Education",
    description: "Consistent, easy-to-print material suited to classroom and workshop print queues.",
    image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/3d0d7cab9fc5daed-18.jpg",
    imageAlt: "Multi-color PLA Basic 3D-printed character figurine sample",
  },
  {
    title: "Industrial prototyping",
    description: "Repeatable extrusion tolerances for functional and visual prototype runs.",
    image: "/images/factory-line-closeup.jpg",
    imageAlt: "Close-up of Shuzhihai filament extrusion and spooling equipment",
  },
]

export function ApplicationsPreview() {
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-sm font-medium text-primary">Who we supply</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Application-fit material for five kinds of buyers
              </h2>
            </div>
            <Link href="/applications" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Explore applications
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div key={app.title} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {app.image ? (
                <div className="relative aspect-[4/3] w-full bg-secondary/50">
                  <Image src={app.image} alt={app.imageAlt} fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-primary/15 via-accent/15 to-secondary" aria-hidden />
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-foreground">{app.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{app.description}</p>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
