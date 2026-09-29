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

import {PageMainMedia} from '@/app/components/page/PageMainMedia'
import PageHeroText from '@/app/components/page/PageHeroText'
import FeaturedProjects from '@/app/components/project/FeaturedProjects.client'
import ScrollCue from '@/app/components/page/ScrollCue.client'
import {GridContainer, GridBlock, GridColumn} from '@/app/components/ui/GridSystem'
import OtherProducts from '@/app/components/product/OtherProducts.client'
import SpecsBlock from '@/app/components/product/SpecsBlock'

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

  const otherProducts = (otherProductsRaw ?? []).filter(
    (item): item is NonNullable<typeof item> & {title: string; slug: string} =>
      Boolean(item?._id && item.title && item.slug),
  )

  const productHref = localizedPath(lang, productPath(product.category.slug, product.slug))
  const {mainImage, heroVideo, description, title, featuredProjects} = product
  const heroPlaybackId =
    heroVideo != null &&
    typeof heroVideo === 'object' &&
    'playbackId' in heroVideo &&
    typeof heroVideo.playbackId === 'string' &&
    heroVideo.playbackId.length > 0
      ? heroVideo.playbackId
      : null

  const featuredProjectItems =
    featuredProjects
      ?.filter((item): item is NonNullable<typeof item> & {slug: string} =>
        Boolean(item?._id && item.slug),
      )
      .map((item) => mapProductFeaturedProjectItemToProjectCardData(item)) ?? []

  return (
    <div className="container grid">
      <ScrollCue />
      <div className="col-start-1 row-start-1">
        <GridContainer>
          <GridColumn
            span={6}
            className="grid grid-rows-[auto_14svh] self-start sticky top-0 h-svh"
          >
            <GridBlock borders="none" className="p-10 relative">
              <PageMainMedia
                className="absolute inset-10"
                mainImage={mainImage}
                title={title ?? ''}
                heroPlaybackId={heroPlaybackId}
              />
            </GridBlock>
            <GridBlock borders="top" className="w-full">
              {null}
            </GridBlock>
          </GridColumn>
          <GridColumn span={6} className="sticky">
            <GridBlock borders="bottom">
              <PageHeroText
                title={title ?? ''}
                description={description ? toPortableTextBlocks(description) : null}
              />
            </GridBlock>
            {featuredProjectItems.length > 0 ? (
              <FeaturedProjects items={featuredProjectItems} lang={lang} />
            ) : null}
            {product.specs?.items?.length ? (
              <SpecsBlock
                items={product.specs.items.filter((item): item is {_key: string; text: string} =>
                  Boolean(item?._key && item.text),
                )}
              />
            ) : null}
          </GridColumn>
        </GridContainer>
        <GridContainer variant="compact" className="max-lg:grid-cols-1 max-lg:after:hidden ">
          <GridColumn span={6} className="min-w-0 max-lg:contents -mt-[14svh]">
            <ContactFormSection
              className=" max-lg:order-4 h-full flex-col flex pb-[14svh]"
              form={formConfig}
              context={{title: title || undefined, url: productHref}}
              title="Get an Instant Quote"
            />
          </GridColumn>
          <GridColumn span={6} className="max-lg:contents">
            {otherProducts.length > 0 ? (
              <OtherProducts
                heading="Other Products"
                items={otherProducts.map((otherProduct) => ({
                  _id: otherProduct._id,
                  title: otherProduct.title,
                  href: productPath(product.category.slug, otherProduct.slug),
                  subtitle: product.category.title,
                  image: otherProduct.mainImage,
                }))}
              />
            ) : null}
          </GridColumn>
        </GridContainer>
      </div>
    </div>
  )
}
