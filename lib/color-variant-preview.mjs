export function selectColorVariant(variants, selectedSlug) {
  return variants.find((variant) => variant.slug === selectedSlug) ?? variants[0]
}
