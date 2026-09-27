import type {
  AllProjectsQueryResult,
  GetProductCategoryQueryResult,
  GetProductQueryResult,
  HomePageQueryResult,
} from '@/sanity.types'

import type {ProjectCardData, ProjectCardImage, ProjectCardRelatedEntity} from '@/app/components/project/types'

type HomeFeaturedProjectItem = NonNullable<
  NonNullable<HomePageQueryResult>['featuredProjects']
>['items'][number]
type ProductFeaturedProjectItem = NonNullable<
  NonNullable<GetProductQueryResult | GetProductCategoryQueryResult>['featuredProjects']
>[number]
type AllProjectItem = AllProjectsQueryResult[number]

/** Shared card source for listing + "other projects" query rows. */
type MappableProjectItem = {
  _id: string
  title: string | null
  slug: string
  mainImage?: unknown
  gallery?: unknown
  product?: {
    _id: string
    title: string | null
    slug: string
    category?: {
      _id: string
      title: string | null
      slug: string
    } | null
  } | null
}

type MappableProduct = {
  _id: string
  title?: string | null
  slug?: string | null
  category?: {
    _id: string
    title?: string | null
    slug?: string | null
  } | null
}

function toProjectImage(image: unknown): ProjectCardImage {
  if (!image || typeof image !== 'object') {
    return null
  }
  return image as ProjectCardImage
}

function toProjectGallery(value: unknown): NonNullable<ProjectCardImage>[] | undefined {
  if (!Array.isArray(value)) return undefined
  const images = value
    .map((image) => toProjectImage(image))
    .filter((image): image is NonNullable<ProjectCardImage> => Boolean(image?.asset?._ref))
  return images.length > 0 ? images : undefined
}

function readGallery(item: object): unknown {
  return 'gallery' in item ? item.gallery : undefined
}

function mapProductField(value: unknown): ProjectCardRelatedEntity | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const product = value as MappableProduct
  if (!product._id) return null
  return {
    _id: product._id,
    title: product.title,
    slug: product.slug,
    category: product.category
      ? {
          _id: product.category._id,
          title: product.category.title,
          slug: product.category.slug,
        }
      : null,
  }
}

function toProjectCardData(item: {
  _id: string
  title: string | null
  slug: string
  mainImage?: unknown
  gallery?: unknown
  product?: unknown
}): ProjectCardData {
  return {
    _id: item._id,
    title: item.title ?? '',
    slug: item.slug,
    mainImage: toProjectImage(item.mainImage),
    gallery: toProjectGallery(item.gallery),
    product: mapProductField(item.product),
  }
}

export function mapHomeFeaturedProjectItemToProjectCardData(
  item: HomeFeaturedProjectItem,
): ProjectCardData {
  return toProjectCardData(item)
}

export function applyFeaturedOrder(
  items: ProjectCardData[],
  featuredIds: (string | null | undefined)[] | null | undefined,
): {items: ProjectCardData[]; featuredCount: number} {
  if (!featuredIds?.length) return {items, featuredCount: 0}
  const byId = new Map(items.map((i) => [i._id, i]))
  const featured = featuredIds
    .map((id) => (id ? byId.get(id) : undefined))
    .filter((i): i is ProjectCardData => Boolean(i))
  const featuredSet = new Set(featured.map((i) => i._id))
  const rest = items.filter((i) => !featuredSet.has(i._id))
  return {items: [...featured, ...rest], featuredCount: featured.length}
}

export function mapAllProjectItemToProjectCardData(
  item: AllProjectItem | MappableProjectItem,
): ProjectCardData {
  return toProjectCardData({
    ...item,
    gallery: readGallery(item),
  })
}

export function mapProductFeaturedProjectItemToProjectCardData(
  item: ProductFeaturedProjectItem,
): ProjectCardData {
  return toProjectCardData({
    ...item,
    gallery: readGallery(item),
  })
}
