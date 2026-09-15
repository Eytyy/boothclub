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
  products?: Array<{
    _id: string
    title: string | null
    slug: string
    category?: {
      _id: string
      title: string | null
      slug: string
    } | null
  }> | null
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

function mapProductsField(value: unknown): ProjectCardRelatedEntity[] | null {
  if (!value || !Array.isArray(value)) return null
  return value.map((entity) => {
    const product = entity as MappableProduct
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
  })
}

function toProjectCardData(item: {
  _id: string
  title: string | null
  slug: string
  mainImage?: unknown
  products?: unknown
}): ProjectCardData {
  return {
    _id: item._id,
    title: item.title ?? '',
    slug: item.slug,
    mainImage: toProjectImage(item.mainImage),
    products: mapProductsField(item.products),
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
  return toProjectCardData(item)
}

export function mapProductFeaturedProjectItemToProjectCardData(
  item: ProductFeaturedProjectItem,
): ProjectCardData {
  return toProjectCardData({
    _id: item._id,
    title: item.title,
    slug: item.slug,
    mainImage: item.mainImage,
  })
}
