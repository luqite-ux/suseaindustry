import { Reveal } from "@/components/reveal"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    q: "Is PLA Basic one product or nineteen different products?",
    a: "It is one filament formulation offered in 19 colors. The material specification, printing temperature range, and handling are the same across every color.",
  },
  {
    q: "Can you match a custom color?",
    a: "Yes. Color masterbatch modification is done in-house, so a target shade can be developed and confirmed before production.",
  },
  {
    q: "Do you support OEM / private label orders?",
    a: "Yes. OEM/ODM production, custom spool labeling, and packaging are available — share your brand requirements through the quote form and we'll confirm feasibility.",
  },
  {
    q: "What is your minimum order quantity?",
    a: "Minimum order quantities depend on color, packaging, and customization requirements. Share your target volume in the quote form and we'll confirm it directly.",
  },
  {
    q: "Which buyers do you typically work with?",
    a: "Distributors, cross-border e-commerce sellers, makers and hobbyist retailers, education suppliers, and industrial prototyping teams.",
  },
]

export function FaqSection() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">FAQ</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Common questions from buyers
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-8">
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-2 sm:px-4">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium sm:text-base">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
