export type ProductCardImage = {
  asset?: {_ref?: string | null} | null
  alt?: string | null
  hotspot?: {x: number; y: number} | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  lqip?: string | null
} | null

export type ProductFeaturedProjectItem = {
  _id: string
  title?: string | null
  mainImage?: ProductCardImage
}

export type ProductCardData = {
  _id: string
  title: string
  slug: string
  categorySlug: string
  excerpt?: string | null
  subtitle?: string | null
  description?: unknown
  mainImage?: ProductCardImage
  featuredProjects?: ProductFeaturedProjectItem[] | null
}
