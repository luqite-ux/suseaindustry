import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { headers } from 'next/headers'
import {localized} from './locale-path'
export {localized} from './locale-path'

export type SiteProduct={id:string;slug:string;name:string;shortName:string;category:string;categorySlug:string;tagline:string;summary:string;image:string;overview:string;features:string[];applications:string[];specs:[string,string][];related:string[];gallery:string[];updatedAt?:string;extra:Record<string,any>}

export function tenantId() {
  const id = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!id) throw new Error('Tenant configuration is missing')
  return id
}
export function database() {
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if(!url || !key) throw new Error('Database configuration is missing')
  return createClient(url,key,{auth:{persistSession:false}})
}
const settingsFields='id,domain,display_name,logo_url,favicon_url,brand_color,default_language,supported_languages,site_title_i18n,site_tagline_i18n,site_description_i18n,contact_email,contact_phone,contact_whatsapp,contact_address_i18n,contact_address_short,social_links,seo_title_i18n,seo_description_i18n,seo_keywords_i18n,google_analytics_id,google_tag_manager_id,extra_settings'
export const getSettings=unstable_cache(async()=>{
  const {data,error}=await database().from('tenants').select(settingsFields).eq('id',tenantId()).single()
  if(error)throw new Error('Site settings are unavailable')
  return data
},['tenant-public-settings'],{revalidate:60,tags:['site-settings']})
export async function getLocale(requested?:string){
  const settings=await getSettings()
  const candidate=requested || (await headers()).get('x-site-locale') || settings.default_language || 'en'
  return (settings.supported_languages||[]).includes(candidate)?candidate:settings.default_language||'en'
}
const productRows=unstable_cache(async()=>{
  const {data,error}=await database().from('products').select('*').eq('tenant_id',tenantId()).eq('is_active',true).order('sort_order')
  if(error)throw new Error('Equipment catalogue is temporarily unavailable')
  return data
},['tenant-products'],{revalidate:60,tags:['products']})
export const categoryRows=unstable_cache(async()=>{
  const {data,error}=await database().from('product_categories').select('id,slug,name,name_i18n,parent_id,sort_order').eq('tenant_id',tenantId()).eq('is_active',true).order('sort_order')
  if(error)throw new Error('Equipment categories are unavailable')
  return data
},['tenant-categories'],{revalidate:60,tags:['categories']})
export async function getProducts(locale?:string):Promise<SiteProduct[]>{
  const [rows,categories,settings,lang]=await Promise.all([productRows(),categoryRows(),getSettings(),getLocale(locale)])
  return rows.map(p=>{
    const category=categories.find(c=>c.slug===p.category_slug)
    const read=<T,>(value:Record<string,T>,legacy:T)=>localized(value,lang,settings.default_language||'en',legacy)
    return {id:p.id,slug:p.slug||p.id,name:read(p.name_i18n,p.name),shortName:p.model||read(p.name_i18n,p.name),category:category?read(category.name_i18n,category.name):p.category||'Equipment',categorySlug:p.category_slug||'',tagline:read(p.description_i18n,p.description||''),summary:read(p.description_i18n,p.description||''),image:p.image_url||'',overview:read(p.overview_i18n,p.overview||''),features:read(p.features_i18n,p.features||[]),applications:read(p.applications_i18n,p.applications||[]),specs:Object.entries(p.specs||{}).map(([k,v])=>[k,String(v)]),related:[],gallery:p.extra_data?.gallery||[],updatedAt:p.updated_at,extra:p.extra_data||{}}
  })
}
export async function getProductBySlug(slug:string,locale?:string){return (await getProducts(locale)).find(p=>p.slug===slug)}
export async function getRelatedProducts(product:SiteProduct,locale?:string){return (await getProducts(locale)).filter(p=>p.slug!==product.slug).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)).slice(0,3)}
const articleRows=unstable_cache(async()=>{
  const {data,error}=await database().from('articles').select('*').eq('tenant_id',tenantId()).eq('is_published',true).contains('placement_keys',['news']).order('published_at',{ascending:false})
  if(error)throw new Error('News is temporarily unavailable')
  return data
},['tenant-articles'],{revalidate:60,tags:['articles']})
export async function getArticles(locale?:string){
  const [rows,settings,lang]=await Promise.all([articleRows(),getSettings(),getLocale(locale)])
  return rows.map(p=>({...p,title:localized(p.title_i18n,lang,settings.default_language||'en',p.title),excerpt:localized(p.excerpt_i18n,lang,settings.default_language||'en',p.excerpt||''),content:localized(p.content_i18n,lang,settings.default_language||'en',p.content||'')}))
}

export async function getSite(locale?:string) {
  const [settings,lang]=await Promise.all([getSettings(),getLocale(locale)])
  const profile=settings.extra_settings?.company_profile || {}
  const read=(value:Record<string,string>|undefined,fallback='')=>localized(value,lang,settings.default_language||'en',fallback)
  return {
    brand:read(settings.site_title_i18n,profile.brand||''),
    legalName:read(settings.extra_settings?.legal_name_i18n,profile.legalName||''),
    domain:settings.domain,logo:settings.logo_url||'/images/logo.png',favicon:settings.favicon_url||'/icon.png',
    email:settings.contact_email||'',phone:settings.contact_phone||'',phoneDisplay:settings.contact_phone||'',
    landline:profile.landline||'',
    address:read(settings.contact_address_i18n,settings.contact_address_short||''),
    description:read(settings.site_description_i18n),
    founded:Number(profile.founded),siteAreaSqm:Number(profile.siteAreaSqm),monthlyCapacityCabinets:Number(profile.monthlyCapacity),typicalLeadTimeDays:Number(profile.typicalLeadTimeDays),moqUnits:1,
  }
}

export async function getFaqs():Promise<{question:string;answer:string}[]> {
  return (await getSettings()).extra_settings?.company_profile?.faq || []
}
