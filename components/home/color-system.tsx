import { Reveal } from "@/components/reveal"
import { ColorSelector } from "@/components/color-selector"
import { getProducts } from "@/lib/content-db"
import type {FilamentColor} from "@/lib/colors"

export async function ColorSystem() {
  const product=(await getProducts('en'))[0]
  if(!product)return null
  const variants=Array.isArray(product.extra.color_variants)?product.extra.color_variants:[]
  const filamentColors:FilamentColor[]=variants.map((variant:any)=>({slug:String(variant.slug||''),name:String(variant.name||''),swatch:String(variant.swatch||'#7c8aa5'),photo:String(variant.product_image||''),sample:String(variant.sample_image||'')})).filter((color:FilamentColor)=>color.slug&&color.name&&color.photo)
  if(filamentColors.length!==19)return null
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
