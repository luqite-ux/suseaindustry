import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {ChevronRight} from 'lucide-react'
import {getArticles} from '@/lib/content-db'
export const revalidate=60
export const dynamicParams=true
async function article(slug:string){return (await getArticles('en')).find(item=>item.slug===slug)}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=await article(slug);if(!item)return{};return{title:item.title,description:item.excerpt,alternates:{canonical:`/news/${slug}`},openGraph:{title:item.title,description:item.excerpt,type:'article',images:item.featured_image?[item.featured_image]:[]}}}
export default async function NewsArticlePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=await article(slug);if(!item)notFound();return <article className="py-16 sm:py-20"><div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"><nav className="flex items-center gap-1.5 text-sm text-muted-foreground"><Link href="/news">News</Link><ChevronRight className="size-3.5"/><span>{item.title}</span></nav><time className="mt-8 block text-sm text-muted-foreground">{item.published_at?.slice(0,10)}</time><h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{item.title}</h1><div className="article-prose mt-8" dangerouslySetInnerHTML={{__html:item.content}}/></div></article>}
