import type { Metadata } from "next"
import Image from "next/image"
import { Reveal, RevealGroup } from "@/components/reveal"
import { QuoteCta } from "@/components/quote-cta"

export const metadata: Metadata = {
  title: "Applications",
  description:
    "PLA Basic filament applications for distributors, cross-border sellers, makers, education, and industrial prototyping buyers.",
  alternates: { canonical: "/applications" },
  openGraph: {
    url: "/applications",
    images: [
      {
        url: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/6c36e88e00b8049e-3.jpg",
        alt: "3D printed sample made with PLA Basic filament",
      },
    ],
  },
}

const applications: Array<{ title: string; description: string; image?: string; imageAlt?: string }> = [
  {
    title: "Distributors & resellers",
    description:
      "Build a multi-color PLA Basic catalog from a single supply relationship. Consistent material specification across all 19 colors simplifies inventory and quality expectations.",
    image: "/images/pla-basic-purple.png",
    imageAlt: "Purple PLA Basic filament retail presentation for distributor catalogs",
  },
  {
    title: "Cross-border e-commerce sellers",
    description:
      "OEM labeling and custom packaging support private-label filament listings without the buyer needing their own production line.",
    image: "/images/pla-basic-metallic.png",
    imageAlt: "Metallic PLA Basic filament retail presentation for cross-border listings",
  },
  {
    title: "Makers & hobbyists",
    description:
      "Clean, pure color and dimensionally accurate extrusion for everyday desktop printing — from figurines to functional parts.",
    image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/6c36e88e00b8049e-3.jpg",
    imageAlt: "Purple PLA Basic 3D-printed unicorn figurine sample",
  },
  {
    title: "Education & workshops",
    description:
      "Low-warp, clog-free material suited to classroom and workshop print queues where reliability matters as much as color range.",
    image: "https://pub-c7a22068052144a5805830c30d280128.r2.dev/site-assets/suseaindustry/products/ai-watermark-cleaned/3d0d7cab9fc5daed-18.jpg",
    imageAlt: "Multi-color PLA Basic 3D-printed character figurine sample",
  },
  {
    title: "Industrial prototyping",
    description:
      "Repeatable extrusion tolerances support functional and visual prototype runs where dimensional accuracy affects fit and finish.",
    image: "/images/factory-line-closeup.jpg",
    imageAlt: "Close-up of Shuzhihai filament extrusion and spooling equipment",
  },
]

export default function ApplicationsPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-sm font-medium text-primary">Applications</span>
            <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Built for five kinds of buyers
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              The same PLA Basic material supports very different buying needs — from catalog depth for distributors
              to reliability for classroom print queues.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealGroup className="grid gap-6">
            {applications.map((app, i) => (
              <div
                key={app.title}
                className={`grid gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-10 ${
                  app.image ? "" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{app.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{app.description}</p>
                </div>
                <div className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary/50 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  {app.image ? (
                    <Image src={app.image} alt={app.imageAlt ?? app.title} fill sizes="(min-width: 1024px) 480px, 90vw" className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/15 via-accent/15 to-secondary" aria-hidden />
                  )}
                </div>
              </div>
            ))}
          </RevealGroup>
        </div>
      </section>

      <QuoteCta />
    </>
  )
}
