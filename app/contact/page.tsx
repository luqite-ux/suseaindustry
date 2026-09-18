import type { Metadata } from "next"
import { Factory, Mail, MapPin } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { Reveal } from "@/components/reveal"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ningbo Shuzhihai New Materials for PLA Basic filament, color matching, OEM/ODM and packaging inquiries.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", images: [{ url: "/images/factory-line-wide.jpg", alt: "Shuzhihai filament production line" }] },
}

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <span className="text-sm font-medium text-primary">Contact</span>
            <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Discuss your filament requirements with our team.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">Share your target colors, order volume, packaging format and application. We will confirm feasibility and the appropriate next step.</p>
          </Reveal>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <Reveal className="space-y-6">
            <div className="flex gap-3"><Factory className="mt-0.5 size-5 text-primary" /><div><h2 className="font-semibold text-foreground">Manufacturer-direct discussion</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">PLA Basic filament, color masterbatch modification, OEM/ODM and custom packaging.</p></div></div>
            <div className="flex gap-3"><MapPin className="mt-0.5 size-5 text-primary" /><div><h2 className="font-semibold text-foreground">Ningbo, Zhejiang, China</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Production and buyer coordination are handled from Ningbo.</p></div></div>
            <div className="flex gap-3"><Mail className="mt-0.5 size-5 text-primary" /><div><h2 className="font-semibold text-foreground">Written quotation workflow</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Product scope, lead time and commercial terms are confirmed per inquiry.</p></div></div>
          </Reveal>
          <Reveal delay={100}><ContactForm /></Reveal>
        </div>
      </section>
    </>
  )
}
