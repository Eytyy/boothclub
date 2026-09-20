import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapProductFeaturedProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {getProductQuery, otherProductsQuery, productSlugs} from '@/sanity/lib/queries'
import {resolveMetaTitle, resolveOpenGraphImage, toPortableTextBlocks} from '@/sanity/lib/utils'
import ContactFormSection from '@/app/components/forms/ContactFormSection'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import SectionTitle from '@/app/components/ui/SectionTitle'

import {HeroShuffle} from './Bits.client'
import FeaturedProjects from './FeaturedProjects.client'
import {ProductMainMedia} from '../ProductMainMedia'
import GridContainer from '@/app/components/ui/GridContainer'
import ProductHeroText from '../ProductMainText'
import ProductCard from '../ProductCard'
import SpecsBlock from '@/app/components/product/SpecsBlock'
import CopyBlock from '@/app/components/product/CopyBlock'

type Props = {
  params: Promise<{lang: Locale; slug: string; product: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: productSlugs,
    perspective: 'published',
    stega: false,
  })

  return locales.flatMap((lang) =>
    (data ?? [])
      .filter((item): item is {slug: string; categorySlug: string} =>
        Boolean(item.slug && item.categorySlug),
      )
      .map(({slug, categorySlug}) => ({lang, slug: categorySlug, product: slug})),
  )
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {lang, slug, product: productSlug} = await props.params
  const {data: product} = await sanityFetch({
    query: getProductQuery,
    params: {lang, slug, product: productSlug},
    stega: false,
  })

  const seo = product?.seo
  const featuredProjectFallbackImage = product?.featuredProjects?.find(
    (item) => item?.mainImage?.asset?._ref,
  )?.mainImage as SanityImageSource | undefined

  const ogImage =
    resolveOpenGraphImage(seo?.metaImage) ??
    resolveOpenGraphImage(product?.mainImage as SanityImageSource | undefined) ??
    resolveOpenGraphImage(featuredProjectFallbackImage)
  const parentMetadata = await parent
  const parentOgImages = parentMetadata.openGraph?.images ?? []
  const canonicalPath =
    product?.category?.slug && product.slug
      ? productPath(product.category.slug, product.slug)
      : productPath(slug, productSlug)

  return {
    title: resolveMetaTitle(seo?.metaTitle, product?.title),
    description: seo?.metaDescription || product?.excerpt || undefined,
    alternates: localeAlternates(lang, canonicalPath),
    openGraph: {
      images: ogImage ? [ogImage] : parentOgImages,
    },
  } satisfies Metadata
}

export default async function ProductPage(props: Props) {
  const {lang, slug, product: productSlug} = await props.params
  const {data: product} = await sanityFetch({
    query: getProductQuery,
    params: {lang, slug, product: productSlug},
  })

  if (!product?._id || !product.slug || !product.category?.slug || !product.category._id) {
    return notFound()
  }

  const [{data: otherProductsRaw}, formConfig] = await Promise.all([
    sanityFetch({
      query: otherProductsQuery,
      params: {lang, currentId: product._id, categoryId: product.category._id},
    }),
    fetchFormConfigByKey('contact-us', lang),
  ])

  const featuredProjectItems =
    product.featuredProjects
      ?.filter((item): item is NonNullable<typeof item> & {slug: string} =>
        Boolean(item?._id && item.slug),
      )
      .map((item) => mapProductFeaturedProjectItemToProjectCardData(item)) ?? []

  const otherProducts = (otherProductsRaw ?? []).filter(
    (item): item is NonNullable<typeof item> & {title: string; slug: string} =>
      Boolean(item?._id && item.title && item.slug),
  )

  const productHref = localizedPath(lang, productPath(product.category.slug, product.slug))
  const {mainImage, heroVideo, description, title} = product
  const heroPlaybackId =
    heroVideo != null &&
    typeof heroVideo === 'object' &&
    'playbackId' in heroVideo &&
    typeof heroVideo.playbackId === 'string' &&
    heroVideo.playbackId.length > 0
      ? heroVideo.playbackId
      : null

  return (
    <div className="container">
      <GridContainer>
        <div className="col-span-6 grid grid-rows-[auto_14svh] self-start sticky top-0 h-svh">
          <div className="p-10 relative">
            <ProductMainMedia
              className="absolute inset-10"
              mainImage={mainImage}
              title={title ?? ''}
              heroPlaybackId={heroPlaybackId}
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-10 border-t-4 border-black dark:border-white ">
            <div className="flex flex-col items-center justify-center">
              <div className="w-6 h-6 border-4 border-t-0 border-r-0 border-black dark:border-white -rotate-45"></div>
              <div className="w-6 h-6 border-4 border-t-0 border-r-0 border-black dark:border-white -rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="col-span-6 sticky">
          <div className="p-10 border-b-4 border-black dark:border-white">
            <HeroShuffle items={featuredProjectItems} />
          </div>
          <div className="p-10 border-b-4 border-black dark:border-white">
            <ProductHeroText
              title={title ?? ''}
              description={description ? toPortableTextBlocks(description) : null}
            />
          </div>
          {product.specs?.items?.length ? (
            <SpecsBlock
              items={product.specs.items.filter((item): item is {_key: string; text: string} =>
                Boolean(item?._key && item.text),
              )}
            />
          ) : null}
        </div>
      </GridContainer>
      <GridContainer variant="compact" className="max-lg:grid-cols-1 max-lg:after:hidden">
        <div className="col-span-6 min-w-0 max-lg:contents">
          {product.copy ? (
            <CopyBlock
              showHeadline={product.copy.showHeadline ?? undefined}
              showText={product.copy.showText ?? undefined}
              headline={product.copy.headline ?? undefined}
              text={product.copy.text ?? undefined}
            />
          ) : null}
          {featuredProjectItems.length > 0 ? (
            <FeaturedProjects className="max-lg:order-3" items={featuredProjectItems} />
          ) : null}
          {otherProducts.length > 0 && (
            <>
              {otherProducts.map((otherProduct) => (
                <ProductCard
                  className="last:border-b-0 first:pt-0"
                  key={otherProduct._id}
                  href={productPath(product.category.slug, otherProduct.slug)}
                  title={otherProduct.title}
                  image={otherProduct.mainImage}
                />
              ))}
            </>
          )}
        </div>
        <div className="col-span-6 max-lg:contents">
          <ContactFormSection
            className="p-10 lg:sticky lg:top-0 max-lg:order-4"
            form={formConfig}
            context={{title: title || undefined, url: productHref}}
            heading={<SectionTitle as="h2">Get in Touch</SectionTitle>}
          />
        </div>
      </GridContainer>
    </div>
  )
}
