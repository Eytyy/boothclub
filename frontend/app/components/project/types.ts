export type ProjectCardImage = {
  asset?: {_ref?: string | null} | null
  alt?: string | null
  hotspot?: {x: number; y: number} | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  lqip?: string | null
} | null

export type ProjectCardRelatedEntity = {
  _id: string
  title?: string | null
  slug?: string | null
  category?: {
    _id: string
    title?: string | null
    slug?: string | null
  } | null
}

export type ProjectFilterOption = {
  _id: string
  title: string | null
  slug: string | null
  products?: ProjectFilterOption[]
}

// Canonical view-model for reusable project cards.
export type ProjectCardData = {
  _id: string
  title: string
  slug: string
  mainImage?: ProjectCardImage
  gallery?: NonNullable<ProjectCardImage>[]
  product?: ProjectCardRelatedEntity | null
}
