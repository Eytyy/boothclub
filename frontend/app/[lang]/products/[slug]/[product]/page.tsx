import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapProductFeaturedProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {getProductQuery, otherProductsQuery, productSlugs} from '@/sanity/lib/queries'
import {resolveMetaTitle, resolveOpenGraphImage, toPortableTextBlocks} from '@/sanity/lib/utils'
import ContentBlocks from '@/app/components/page-builder/ContentBlocks'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import ContactFormSection from '@/app/components/forms/ContactFormSection'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import SectionTitle from '@/app/components/ui/SectionTitle'
import {ProjectCardData} from '@/app/components/project/types'
import {cn} from '@/app/lib/utils'
import Image from '@/app/components/ui/SanityImage.client'
import PageTitle from '@/app/components/ui/PageTitle'

import PortableText from '@/app/components/ui/PortableText'
import {HeroShuffle} from './MockPinnedProjects.client'
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
  const productTitle = product.title ?? ''
  const {mainImage, heroVideo} = product
  const heroPlaybackId =
    heroVideo != null &&
    typeof heroVideo === 'object' &&
    'playbackId' in heroVideo &&
    typeof heroVideo.playbackId === 'string' &&
    heroVideo.playbackId.length > 0
      ? heroVideo.playbackId
      : null

  return (
    <div className="mb-20 space-y-10">
      <div className="space-y-10 ">
        <ProductHero
          mainImage={mainImage}
          productTitle={productTitle}
          product={product}
          featuredProjects={featuredProjectItems}
        />
      </div>
      <div className="">
        <ContentBlocks blocks={product.pageBuilder ?? []} />
      </div>
      {featuredProjectItems.length > 0 ? <FeaturedProjects items={featuredProjectItems} /> : null}

      <ContactFormSection
        className="mt-20 lg:px-10"
        form={formConfig}
        context={{title: productTitle || undefined, url: productHref}}
        heading={<SectionTitle as="h2">Get in Touch</SectionTitle>}
      />

      {otherProducts.length > 0 && (
        <section className="relative lg:px-10 lg:mb-28 mt-20 space-y-10 flex flex-col">
          <SectionTitle>Other Products</SectionTitle>
          <div className=" grid grid-cols-3 gap-10">
            {otherProducts.map((otherProduct) => (
              <LocalizedLink
                key={otherProduct._id}
                href={productPath(product.category.slug, otherProduct.slug)}
                className="hover:underline flex flex-col gap-4"
              >
                <div className="border aspect-square border-black"></div>
                <h2 className="text-xl font-semibold leading-[1.1] lg:text-2xl 2xl:text-3xl">
                  {otherProduct.title}
                </h2>
              </LocalizedLink>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ProductHero({
  mainImage,
  productTitle,
  product,
  featuredProjects,
}: {
  mainImage: SanityImageSource
  productTitle: string
  product: Product
  featuredProjects: ProjectCardData[]
}) {
  return (
    <div className="grid grid-cols-[140px_repeat(8,1fr)_140px] gap-10 px-10 min-h-svh py-10">
      <div className="aspect-square  col-start-2 col-span-4">
        {mainImage?.asset?._ref ? (
          <Image
            className="h-full w-full  object-cover"
            id={mainImage.asset._ref}
            alt=""
            aria-hidden="true"
            width={1200}
            height={1200}
            mode="cover"
            hotspot={mainImage.hotspot}
            crop={mainImage.crop}
            preview={mainImage.lqip ?? undefined}
          />
        ) : (
          <div className="h-full w-full bg-black/5 dark:bg-white/5" />
        )}
      </div>
      <div className="col-span-4 flex flex-col justify-between">
        <HeroShuffle items={featuredProjects} />
        <div className="space-y-4 self-end">
          <div>
            <LocalizedLink href={productCategoryPath(product.category.slug)}>
              {product.category.title}
            </LocalizedLink>
            <header>
              <PageTitle variant={'large'} className="text-left">
                {productTitle}
              </PageTitle>
            </header>
          </div>
          <PortableText
            className="mx-auto 2xl:max-w-[75ch]  text-base md:text-xl leading-relaxed"
            value={toPortableTextBlocks(product.description)}
          />
        </div>
      </div>
    </div>
  )
}

function FeaturedProjects({items}: {items: ProjectCardData[]}) {
  return (
    <section className={cn('flex flex-col gap-6 md:gap-10')}>
      <div className="overflow-x-clip">
        <div className="flex gap-10 px-5 lg:px-10">
          {items.map((item, index) => (
            <div key={item._id}>
              <ProjectCard item={item} />
            </div>
          ))}
        </div>
      </div>
      <div className="px-10 border mx-auto py-2 font-bold uppercase text-lg">All Projects</div>
    </section>
  )
}

function ProjectCard({item}: {item: ProjectCardData}) {
  const imageRef = item.mainImage?.asset?._ref
  const mainProduct = item.products?.[0]
  return (
    <LocalizedLink href={`/projects/${item.slug}`} className="group block">
      <div className="overflow-hidden rounded-sm">
        {imageRef ? (
          <Image
            id={imageRef}
            alt={item.mainImage?.alt || item.title || ''}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            width={600}
            height={600}
            mode="cover"
            hotspot={item.mainImage?.hotspot ?? undefined}
            crop={item.mainImage?.crop ?? undefined}
            preview={item.mainImage?.lqip ?? undefined}
          />
        ) : (
          <div className="aspect-square w-full bg-black/5 dark:bg-white/5" />
        )}
      </div>
      <div className="flex flex-col items-start gap-2 py-4">
        {mainProduct?.title ? (
          <span className="border text-white dark:text-black bg-black dark:bg-white px-2 py-1 text-xs dark:border-white">
            {mainProduct.title}
          </span>
        ) : null}
        {item.title ? (
          <h3 className="text-xl font-semibold leading-[1.1] lg:text-2xl 2xl:text-3xl">
            {item.title}
          </h3>
        ) : null}
      </div>
    </LocalizedLink>
  )
}
