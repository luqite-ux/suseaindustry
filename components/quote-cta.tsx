import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

export function QuoteCta({
  title = "Ready to talk about your filament order?",
  description = "Tell us the colors, volume, and customization you need — we'll confirm feasibility, packaging, and lead time.",
}: {
  title?: string
  description?: string
}) {
  return (
    <section className="border-t border-border bg-primary py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">{description}</p>
          <div className="mt-7">
            <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
              <Link href="/contact">
                Request a quote
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
