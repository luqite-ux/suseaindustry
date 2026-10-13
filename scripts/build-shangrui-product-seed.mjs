import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const CATEGORY_MAP = {
  '聚合物改性': { slug: 'polymer-modification', en: 'Polymer Modification' },
  '防水领域': { slug: 'waterproofing-materials', en: 'Waterproofing Materials' },
  '改性填充': { slug: 'modified-fillers', en: 'Modified Fillers' },
  '胶黏剂': { slug: 'adhesive-materials', en: 'Adhesive Materials' },
  'TPE造粒': { slug: 'tpe-compounding', en: 'TPE Compounding' },
  TPE: { slug: 'tpe', en: 'TPE' },
  EVA: { slug: 'eva', en: 'EVA' },
  '色母粒': { slug: 'masterbatch', en: 'Masterbatch' },
}

const ENGLISH_DESCRIPTIONS = {
  '57770104': 'SEBS YH-502T is a medium-molecular-weight hydrogenated SBS polymer supplied as white powder or granules. The source lists flexible processing, transparency and use in plastic modification, soft TPE compounds, soft toys, hot-melt adhesives, glass sealants and cushioning materials.',
  '57770166': 'SIS YH-1105 is a linear SIS triblock copolymer with medium molecular weight, low styrene content and low modulus. The source lists thermoplastic processing, elasticity, melt flow and compatibility with tackifying resins for tapes, labels and plastic modification.',
  '57771531': 'SIS YH-1106 is a blend of linear SIS triblock and SI diblock copolymers with medium molecular weight and low diblock content. The source lists melt processing for tape and label applications.',
  '57771556': 'SEPS YH-4010 is a linear, fully diblock copolymer. The source lists it as a gelling or thickening material for fiber-filling gels, white-oil cosmetic systems and moisture-retaining ointment formulations.',
  '57771561': 'SEPS YH-4030 is described with rapid dissolution, thickening and shear-resistance properties. The source lists use in improving lubricant viscosity-temperature behavior, viscosity index, low-temperature performance and shear stability.',
  '57771563': 'SEPS YH-4051 is a selectively hydrogenated styrene-butadiene and isoprene copolymer. The source lists medical products, soft rubber toys, glazing compounds, TPE compounding and halogen-free flame-retardant cable coating materials as applications.',
  '57771678': 'SEBS YH-503T is a selectively hydrogenated SBS polymer supplied as white powder or granules. The source lists mechanical performance, aging resistance and surface texture for compounding applications.',
}

const SPEC_KEY_MAP = [
  [/^结构$/, 'Structure'],
  [/块内容比率|块内容比率/, 'Block content ratio (%)'],
  [/挥发物|波动率/, 'Volatile matter (%)'],
  [/灰分含量/, 'Ash content (%)'],
  [/组合苯乙烯含量|结合苯乙烯含量|苯乙烯含量/, 'Styrene content (%)'],
  [/Diblock 内容|双块内容/, 'Diblock content (%)'],
  [/^MFR/, 'MFR'],
  [/300% 拉伸强度|应力 300%/, '300% tensile stress (MPa)'],
  [/抗拉强度|拉伸强度/, 'Tensile strength (MPa)'],
  [/断裂伸长率|伸长率/, 'Elongation at break (%)'],
  [/永久变形/, 'Permanent deformation (%)'],
  [/硬度/, 'Hardness (Shore A)'],
  [/氢化/, 'Hydrogenation (%)'],
  [/黄色指数/, 'Yellow index'],
  [/甲苯溶液粘度/, 'Toluene solution viscosity'],
  [/溶液粘度/, 'Solution viscosity'],
  [/外观/, 'Appearance'],
]

const VALUE_MAP = new Map([
  ['线性', 'Linear'],
  ['径向', 'Radial'],
  ['白色粒子', 'White granules'],
  ['白色粉末', 'White powder'],
  ['白色粉末或蓬松的颗粒', 'White powder or fluffy granules'],
])

function englishName(name) {
  return name
    .replace(/^众立\s*/u, 'Zhongli ')
    .replace(/^炭黑\s*/u, 'Carbon Black ')
    .replace(/[、，]/gu, ' / ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\(SEBS\s*\)/i, 'SEBS')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugPart(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
}

function englishSpecs(sourceSpecs) {
  const result = {}
  let fallbackIndex = 0
  for (const [sourceKey, sourceValue] of Object.entries(sourceSpecs || {})) {
    const matched = SPEC_KEY_MAP.find(([pattern]) => pattern.test(sourceKey))
    const key = /^[\x00-\x7f]+$/.test(sourceKey) ? sourceKey : (matched?.[1] || `Source specification ${++fallbackIndex}`)
    const value = VALUE_MAP.get(String(sourceValue).trim()) || String(sourceValue)
    result[key] = /[\u3400-\u9fff]/u.test(value) ? `See source specification ${fallbackIndex || 1}` : value
  }
  return result
}

export function normalizeSourceProducts(sourceProducts) {
  const usedCategories = [...new Set(sourceProducts.map((product) => product.category))]
  const categories = usedCategories.map((sourceName, index) => {
    const mapped = CATEGORY_MAP[sourceName]
    if (!mapped) throw new Error(`Unmapped source category: ${sourceName}`)
    return {
      slug: mapped.slug,
      name: mapped.en,
      name_en: mapped.en,
      name_i18n: { en: mapped.en, zh: sourceName },
      description: `Products listed in the customer's ${mapped.en.toLowerCase()} source category.`,
      description_en: `Products listed in the customer's ${mapped.en.toLowerCase()} source category.`,
      description_i18n: {
        en: `Products listed in the customer's ${mapped.en.toLowerCase()} source category.`,
        zh: `客户中文网站“${sourceName}”分类中的产品。`,
      },
      sort_order: index + 2,
      is_active: true,
      extra_data: { source_site: 'www.shangrui-chemical.com', source_category: sourceName },
      parent_id: null,
    }
  })

  const products = sourceProducts.map((source, index) => {
    const category = CATEGORY_MAP[source.category]
    if (!category) throw new Error(`Unmapped source category: ${source.category}`)
    const nameEn = englishName(source.name)
    const descriptionEn = ENGLISH_DESCRIPTIONS[source.sourceId]
      || `${nameEn} is listed in the customer's ${category.en} source catalog. Detailed specifications and application suitability are confirmed for each inquiry.`
    const descriptionZh = source.summary || `${source.name}，来源于客户中文网站“${source.category}”产品分类。详细参数及适用性以询盘确认结果为准。`
    const slug = `${slugPart(nameEn) || 'source-product'}-${source.sourceId}`
    const gallery = [...source.images]
    return {
      name: nameEn,
      name_en: nameEn,
      name_i18n: { en: nameEn, zh: source.name },
      description: descriptionEn,
      description_en: descriptionEn,
      description_i18n: { en: descriptionEn, zh: descriptionZh },
      overview: descriptionEn,
      overview_en: descriptionEn,
      overview_i18n: { en: descriptionEn, zh: descriptionZh },
      slug,
      model: nameEn,
      category_slug: category.slug,
      image_url: gallery[0],
      features: [],
      features_i18n: { en: [], zh: [] },
      applications: [],
      applications_i18n: { en: [], zh: [] },
      advantages: [],
      advantages_i18n: { en: [], zh: [] },
      specs: englishSpecs(source.specifications),
      sort_order: index + 2,
      is_active: true,
      extra_data: {
        gallery,
        source_images: gallery,
        source_facts: source.facts,
        source_specifications: source.specifications,
        source_site: 'www.shangrui-chemical.com',
        source_url: source.sourceUrl,
        source_product_id: source.sourceId,
        source_product_key: `shangrui-${source.sourceId}`,
        source_category: source.category,
        imported_language_basis: 'source_zh_with_verified_en_translation',
      },
    }
  })

  return { categories, products }
}

async function main() {
  const sourcePath = process.argv[2] || '.codex-migration/source-products.json'
  const outputPath = process.argv[3] || '.codex-migration/normalized-products.json'
  const source = JSON.parse(await readFile(sourcePath, 'utf8'))
  const normalized = normalizeSourceProducts(source.products)
  await writeFile(outputPath, `${JSON.stringify({ ...normalized, generatedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8')
  process.stdout.write(`${JSON.stringify({ outputPath, categoryCount: normalized.categories.length, productCount: normalized.products.length })}\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
