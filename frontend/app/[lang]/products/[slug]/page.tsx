import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapProductFeaturedProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {getProductCategoryQuery, productCategorySlugs} from '@/sanity/lib/queries'
import {
  resolveMetaTitle,
  resolveOpenGraphImage,
  toMetaDescription,
  toPortableTextBlocks,
} from '@/sanity/lib/utils'
import FeaturedProjects from './FeaturedProjects.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import ContactFormSection from '@/app/components/forms/ContactFormSection'
import Image from '@/app/components/ui/SanityImage.client'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import ProductHeroMedia from '@/app/components/product/ProductHeroMedia'
import ProductHeroText from '@/app/components/product/ProductHeroText'
import SectionTitle from '@/app/components/ui/SectionTitle'

type Props = {
  params: Promise<{lang: Locale; slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: productCategorySlugs,
    perspective: 'published',
    stega: false,
  })

  return locales.flatMap((lang) =>
    (data ?? [])
      .filter((item): item is {slug: string} => Boolean(item.slug))
      .map(({slug}) => ({lang, slug})),
  )
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {lang, slug} = await props.params
  const {data: category} = await sanityFetch({
    query: getProductCategoryQuery,
    params: {lang, slug},
    stega: false,
  })

  const seo = category?.seo
  const featuredProjectFallbackImage = category?.featuredProjects?.find(
    (item) => item?.mainImage?.asset?._ref,
  )?.mainImage as SanityImageSource | undefined

  const ogImage =
    resolveOpenGraphImage(seo?.metaImage) ??
    resolveOpenGraphImage(category?.mainImage as SanityImageSource | undefined) ??
    resolveOpenGraphImage(featuredProjectFallbackImage)
  const parentMetadata = await parent
  const parentOgImages = parentMetadata.openGraph?.images ?? []

  return {
    title: resolveMetaTitle(seo?.metaTitle, category?.title),
    description: seo?.metaDescription || toMetaDescription(category?.description) || undefined,
    alternates: localeAlternates(lang, productCategoryPath(slug)),
    openGraph: {
      images: ogImage ? [ogImage] : parentOgImages,
    },
  } satisfies Metadata
}

export default async function ProductCategoryPage(props: Props) {
  const {lang, slug} = await props.params
  const {data: category} = await sanityFetch({
    query: getProductCategoryQuery,
    params: {lang, slug},
  })

  if (!category?._id || !category.slug) {
    return notFound()
  }

  const formConfig = await fetchFormConfigByKey('contact-us', lang)

  const featuredProjectItems =
    category.featuredProjects
      ?.filter((item): item is NonNullable<typeof item> & {slug: string} =>
        Boolean(item?._id && item.slug),
      )
      .map((item) => mapProductFeaturedProjectItemToProjectCardData(item)) ?? []

  const products = (category.products ?? []).filter(
    (item): item is (typeof category.products)[number] & {title: string; slug: string} =>
      Boolean(item?._id && item.title && item.slug),
  )

  const {title, description} = category
  const categoryTitle = title ?? ''
  const categoryHref = localizedPath(lang, productCategoryPath(category.slug))

  return (
    <div className="mb-20 container mt-14">
      <div className="space-y-10 ">
        <ProductHeroText
          title={categoryTitle}
          tagline={category.tagline}
          description={description ? toPortableTextBlocks(description) : null}
        />
      </div>
      {products.length > 0 && (
        <section className="relative lg:px-10 lg:mb-28 mt-20 space-y-10 flex flex-col">
          <div className="grid grid-cols-3 gap-10">
            {products.map((product) => (
              <ProductCard key={product._id} category={category} product={product} />
            ))}
          </div>
        </section>
      )}

      {featuredProjectItems.length > 0 ? (
        <FeaturedProjects tagline={category.tagline ?? ''} items={featuredProjectItems} />
      ) : null}

      <ContactFormSection
        className="mt-20 lg:px-10"
        form={formConfig}
        context={{title: categoryTitle || undefined, url: categoryHref}}
        heading={<SectionTitle as="h2">Get in Touch</SectionTitle>}
      />
    </div>
  )
}

const ProductCard = ({
  product,
  category,
}: {
  category: {slug: string}
  product: {
    title: string
    slug: string
    mainImage?: {
      asset?: {_ref?: string | null} | null
      alt?: string | null
      hotspot?: {x?: number; y?: number} | null
      crop?: {top?: number; bottom?: number; left?: number; right?: number} | null
      lqip?: string | null
    } | null
  }
}) => {
  const image = product.mainImage

  return (
    <LocalizedLink
      href={productPath(category.slug, product.slug)}
      className="hover:underline flex flex-col gap-4"
    >
      <div className="aspect-square overflow-hidden rounded-sm">
        {image?.asset?._ref ? (
          <Image
            className="h-full w-full object-cover"
            id={image.asset._ref}
            alt={image.alt || product.title || ''}
            width={800}
            height={800}
            mode="cover"
            hotspot={image.hotspot}
            crop={image.crop}
            preview={image.lqip ?? undefined}
          />
        ) : (
          <div className="h-full w-full border-2 border-black dark:border-white" />
        )}
      </div>
      <h2 className="text-2xl">{product.title}</h2>
    </LocalizedLink>
  )
}
