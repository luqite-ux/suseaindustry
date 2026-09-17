import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex min-h-[62vh] items-center bg-secondary/30 py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">The requested page was not found.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">Return to the product catalog or contact our team with your PLA filament requirements.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">View products</Link>
          <Link href="/" className="rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}
