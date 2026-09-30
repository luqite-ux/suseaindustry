export function selectColorVariant<T extends { slug: string }>(
  variants: T[],
  selectedSlug: string,
): T | undefined
