import { Reveal } from "@/components/reveal"
import { ColorSelector } from "@/components/color-selector"
import { getProducts } from "@/lib/content-db"
import type {FilamentColor} from "@/lib/colors"

export async function ColorSystem() {
  const product=(await getProducts('en'))[0]
  if(!product)return null
  const names=Array.isArray(product.extra.colors)?product.extra.colors:[]
  const swatches=['#8B7FD1','#F2F0EC','#1C1C1C','#8C7A4B','#C23B3B','#4FA8D8','#EFC53B','#3E8E5A','#2C5FA8','#EDEDE8','#E07A2C','#6B4A34','#8C8C8C','#E8C6A6','#B23E77','#E38FA8','#2E8B57','#667A8C','#C6C7C9']
  const filamentColors:FilamentColor[]=names.map((name:string,index:number)=>({slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,swatch:swatches[index]||'#7c8aa5',photo:product.gallery[index]}))
  return (
    <section className="border-t border-border bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-primary">One product, a controlled color range</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              PLA Basic, available in 19 colors
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              These are variants of a single filament formulation, not separate products — so buyers can build a
              multi-color catalog from one consistent material spec.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <ColorSelector colors={filamentColors} />
        </Reveal>
      </div>
    </section>
  )
}
