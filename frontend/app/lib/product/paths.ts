/** Locale-unprefixed href for a product category page. */
export function productCategoryPath(categorySlug: string): string {
  return `/products/${categorySlug}`
}

/** Locale-unprefixed href for a nested product detail page. */
export function productPath(categorySlug: string, productSlug: string): string {
  return `/products/${categorySlug}/${productSlug}`
}
