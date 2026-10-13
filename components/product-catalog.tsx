'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Search, X, Layers3 } from 'lucide-react'
import { Reveal } from '@/components/reveal'

type CatalogProduct = { id: string; slug: string; name: string; category: string; categorySlug: string; image: string }
const PAGE_SIZE = 12

export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const categories = useMemo(() => {
    const grouped = new Map<string, { slug: string; name: string; count: number }>()
    for (const product of products) {
      const existing = grouped.get(product.categorySlug)
      if (existing) existing.count++
      else grouped.set(product.categorySlug, { slug: product.categorySlug, name: product.category, count: 1 })
    }
    return [...grouped.values()]
  }, [products])
  const filtered = useMemo(() => products.filter(product =>
    (category === 'all' || product.categorySlug === category) &&
    `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [products, category, query])
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const title = category === 'all' ? 'All products' : categories.find(item => item.slug === category)?.name || 'Products'
  const choose = (slug: string) => { setCategory(slug); setPage(1) }
  const paginate = (value: number) => {
    setPage(value)
    document.getElementById('catalog-results')?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }

  return <section className="bg-background py-10 sm:py-14" aria-label="Product catalog">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10 lg:px-8">
      <aside className="min-w-0"><div className="lg:sticky lg:top-28">
        <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"><Layers3 className="size-4" /> Product categories</h2>
        <label htmlFor="catalog-category" className="sr-only">Product category</label>
        <select id="catalog-category" value={category} onChange={event => choose(event.target.value)} className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground lg:hidden"><option value="all">All products ({products.length})</option>{categories.map(item => <option key={item.slug} value={item.slug}>{item.name} ({item.count})</option>)}</select>
        <nav aria-label="Product categories" className="hidden space-y-1 lg:block">{[{ slug: 'all', name: 'All products', count: products.length }, ...categories].map(item => <button key={item.slug} type="button" aria-pressed={category === item.slug} onClick={() => choose(item.slug)} className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${category === item.slug ? 'bg-primary font-semibold text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}><span>{item.name}</span><span className={`text-xs tabular-nums ${category === item.slug ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{item.count}</span></button>)}</nav>
        <div className="mt-8 hidden border-t border-border pt-6 lg:block"><p className="text-sm font-semibold text-foreground">Have a grade in mind?</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Send us your application and material requirements.</p><Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Talk to our team <ArrowRight className="size-4" /></Link></div>
      </div></aside>
      <div id="catalog-results" className="min-w-0 scroll-mt-28">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div><h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2><p role="status" aria-live="polite" className="mt-1 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}{query.trim() ? ` matching “${query.trim()}”` : ' in the catalog'}</p></div>
          <div className="relative sm:w-64"><Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" /><label htmlFor="catalog-search" className="sr-only">Search products by name or grade</label><input id="catalog-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1) }} placeholder="Search a product or grade" className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary" />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); setPage(1) }} className="absolute right-1 top-1 rounded p-2.5 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}</div>
        </div>
        {visible.length ? <div key={`${category}-${currentPage}-${query}`} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((product, index) => <Reveal key={product.id} delay={Math.min(index % 3 * 45, 90)} className="h-full min-w-0"><Link href={`/products/${product.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><div className="relative aspect-[4/3] border-b border-border bg-white">{product.image ? <Image src={product.image} alt={product.name} fill sizes="(min-width:1280px) 290px,(min-width:640px) 45vw,90vw" className="object-contain p-5" /> : <span className="absolute inset-0 flex items-center justify-center text-sm text-slate-600">Image pending</span>}</div><div className="flex flex-1 flex-col p-5"><p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{product.category}</p><h3 className="mt-2 break-words text-lg font-semibold leading-snug text-foreground">{product.name}</h3><div className="mt-auto pt-6"><span className="flex items-center justify-between border-t border-border pt-4 text-sm font-medium text-foreground group-hover:text-primary">Explore product <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></div></div></Link></Reveal>)}
        </div> : <div className="rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-16 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><h3 className="mt-4 text-lg font-semibold text-foreground">No matching products</h3><p className="mt-2 text-sm text-muted-foreground">Try another grade or browse all categories.</p><button type="button" onClick={() => { setQuery(''); choose('all') }} className="mt-5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Reset filters</button></div>}
        {pages > 1 && <nav aria-label="Product pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-6"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="rounded-lg border border-border p-3 text-foreground disabled:opacity-40"><ChevronLeft className="size-4" /></button>{Array.from({ length: pages }, (_, index) => index + 1).map(value => <button key={value} type="button" aria-label={`Page ${value}`} aria-current={currentPage === value ? 'page' : undefined} onClick={() => paginate(value)} className={`min-w-10 rounded-lg border px-3 py-2 text-sm ${currentPage === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-secondary'}`}>{value}</button>)}<button type="button" aria-label="Next page" disabled={currentPage === pages} onClick={() => paginate(currentPage + 1)} className="rounded-lg border border-border p-3 text-foreground disabled:opacity-40"><ChevronRight className="size-4" /></button></nav>}
      </div>
    </div>
  </section>
}
