import { readFile } from 'node:fs/promises'
import { isDeepStrictEqual } from 'node:util'
import { createClient } from '@supabase/supabase-js'
import { normalizeSourceProducts } from './build-shangrui-product-seed.mjs'

const tenant = '278a288f-069f-449c-97f1-670df744bc66'
const config = Object.fromEntries((await readFile('D:/Cursor/Grand/huanqiu-admin/.env', 'utf8')).split(/\r?\n/)
  .filter(line => /^[A-Z_]+=/.test(line)).map(line => {
    const index = line.indexOf('=')
    return [line.slice(0, index), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '')]
  }))
const db = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY)
const { data: before, error } = await db.from('products').select('*').eq('tenant_id', tenant)
if (error) throw error
const source = JSON.parse(await readFile(new URL('../.codex-migration/source-products.json', import.meta.url), 'utf8'))
const expected = normalizeSourceProducts(source.products).products
const changes = []
for (const product of expected) {
  const row = before.find(row => row.slug === product.slug)
  if (!row || row.extra_data?.source_product_id !== product.extra_data.source_product_id) throw Error(`Source mismatch: ${product.slug}`)
  if (!isDeepStrictEqual(row.extra_data.source_specifications, product.extra_data.source_specifications)) throw Error(`Source changed: ${product.slug}`)
  if (!isDeepStrictEqual(row.specs, product.specs)) changes.push({ row, specs: product.specs })
}
console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', products: changes.map(({row,specs}) => ({slug:row.slug,before:row.specs,after:specs})) }))
if (process.argv.includes('--apply')) {
  for (const {row,specs} of changes) {
    const result = await db.from('products').update({specs}).eq('tenant_id',tenant).eq('id',row.id).eq('updated_at',row.updated_at).select('id')
    if (result.error || result.data.length !== 1) throw Error(`Update failed or concurrent edit: ${row.slug}`)
  }
  const {data:after,error:readError} = await db.from('products').select('*').eq('tenant_id',tenant)
  if (readError || after.length !== before.length) throw Error('Readback failed')
  for (const row of before) {
    const current = after.find(item=>item.id===row.id)
    const desired = changes.find(item=>item.row.id===row.id)?.specs || row.specs
    if (!isDeepStrictEqual(current.specs,desired)) throw Error(`Specification mismatch: ${row.slug}`)
    const {specs:a,updated_at:b,...oldFields}=row
    const {specs:c,updated_at:d,...newFields}=current
    if (!isDeepStrictEqual(oldFields,newFields)) throw Error(`Unrelated field changed: ${row.slug}`)
  }
  console.log(JSON.stringify({readback:'PASS',updated:changes.length,productsPreserved:after.length,unrelatedFieldsPreserved:true}))
}
