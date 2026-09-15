import {ExtractPageBuilderType} from '@/sanity/lib/types'

import FeaturedProductsCarousel from '@/app/components/product/FeaturedProductsCarousel.client'
import type {ProductCardData} from '@/app/components/product/types'
import SectionHeader from '../SectionHeader.client'

type FeaturedProductsProps = {
  block: ExtractPageBuilderType<'featuredProducts'>
  index: number
  pageType: string
  pageId: string
}

export default function FeaturedProducts({block}: FeaturedProductsProps) {
  const products: ProductCardData[] =
    block.products
      ?.filter(
        (product): product is typeof product & {title: string; slug: string; categorySlug: string} =>
          Boolean(product?._id && product.title && product.slug && product.categorySlug),
      )
      .map((product) => ({
        _id: product._id,
        title: product.title,
        slug: product.slug,
        categorySlug: product.categorySlug,
        excerpt: product.excerpt ?? null,
        mainImage: product.mainImage ?? null,
        featuredProjects: product.featuredProjects ?? null,
      })) ?? []

  if (!products.length) return null

  return (
    <div className="relative pt-[calc(var(--header-height)+40px)] lg:pt-20 lg:px-10 lg:py-10 lg:min-h-dvh lg:flex lg:flex-col">
      <SectionHeader heading={block.heading} />
      <FeaturedProductsCarousel products={products} />
    </div>
  )
}
