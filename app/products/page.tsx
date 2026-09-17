import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { QuoteCta } from "@/components/quote-cta"
import { getProducts } from "@/lib/content-db"
export const revalidate=60
export const metadata:Metadata={title:'Products',description:'PLA 3D printer filament and material solutions from Ningbo Shuzhihai New Materials.'}
export default async function ProductsPage(){const products=await getProducts('en');return <>
  <section className="border-b border-border bg-secondary/30 py-16 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><Reveal><span className="text-sm font-medium text-primary">Products</span><h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">3D printing filament</h1><p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">Current active products are maintained through the customer content platform.</p></Reveal></div></section>
  <section className="py-16 sm:py-20"><div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">{products.map((product)=><Reveal key={product.id}><Link href={`/products/${product.slug}`} className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2"><div className="relative aspect-[4/3] bg-white"><Image src={product.image} alt={product.name} fill sizes="(min-width:1024px) 600px,100vw" className="object-contain p-6"/></div><div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10"><span className="text-sm font-medium text-primary">{product.category}</span><h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{product.name}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{product.summary}</p><span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">View product details <ArrowRight className="size-4"/></span></div></Link></Reveal>)}</div></section><QuoteCta/>
  </>}
