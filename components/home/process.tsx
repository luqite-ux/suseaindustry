import { Reveal, RevealGroup } from "@/components/reveal"

const steps = [
  { step: "01", title: "Resin & color input", description: "Base PLA resin and color masterbatch are prepared to the target formulation." },
  { step: "02", title: "Extrusion", description: "Material is extruded through the production line under controlled temperature." },
  { step: "03", title: "Cooling & diameter control", description: "Strand cooling and haul-off stabilize the finished filament diameter." },
  { step: "04", title: "Spooling & packaging", description: "Filament is wound onto spools and packed for the confirmed order specification." },
]

export function ProcessSection() {
  return (
    <section className="border-t border-border bg-secondary/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">How it's made</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              From resin to finished spool
            </h2>
          </div>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="text-sm font-semibold text-primary">{s.step}</span>
              <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
