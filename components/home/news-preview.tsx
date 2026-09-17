import Link from "next/link"
import { Newspaper, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getArticles } from "@/lib/content-db"

export async function NewsPreview() {
  const newsArticles=await getArticles('en')
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-sm font-medium text-primary">News</span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Updates from Shuzhihai
              </h2>
            </div>
            <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              Visit newsroom
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10">
          {newsArticles.length === 0 ? (
            <Empty className="rounded-2xl border border-dashed border-border bg-secondary/20 py-14">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Newspaper className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No news posted yet</EmptyTitle>
                <EmptyDescription>
                  New product, capability, and trade-show updates will appear here as soon as they&apos;re published.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : <div className="grid gap-5 md:grid-cols-3">{newsArticles.slice(0,3).map(article=><Link key={article.id} href={`/news/${article.slug}`} className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"><time className="text-xs text-muted-foreground">{article.published_at?.slice(0,10)}</time><h3 className="mt-2 font-semibold text-foreground">{article.title}</h3><p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{article.excerpt}</p><span className="mt-4 text-sm font-medium text-primary">Read article</span></Link>)}</div>}
        </Reveal>
      </div>
    </section>
  )
}
