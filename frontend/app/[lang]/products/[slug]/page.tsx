import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {
  getProductCategoryQuery,
  otherProductsCategoryQuery,
  productCategorySlugs,
} from '@/sanity/lib/queries'
import {
  resolveMetaTitle,
  resolveOpenGraphImage,
  toMetaDescription,
  toPortableTextBlocks,
} from '@/sanity/lib/utils'
import QuoteCtaSection from '@/app/components/forms/QuoteCtaSection'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {PageMainMedia} from '@/app/components/page/PageMainMedia'
import PageHeroText from '@/app/components/page/PageHeroText'
import ScrollCue from '@/app/components/page/ScrollCue.client'
import {GridContainer, GridBlock, GridColumn} from '@/app/components/ui/GridSystem'
import ProductCard from '@/app/components/product/ProductCard'
import OtherProducts from '@/app/components/product/OtherProducts.client'
import TextReveal from '@/app/components/ui/TextReveal.client'

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

  const ogImage =
    resolveOpenGraphImage(seo?.metaImage) ??
    resolveOpenGraphImage(category?.mainImage as SanityImageSource)
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

  const {data: otherCategories} = await sanityFetch({
    query: otherProductsCategoryQuery,
    params: {lang, currentId: category?._id},
  })

  if (!category?._id || !category.slug) {
    return notFound()
  }

  const formConfig = await fetchFormConfigByKey('contact-us', lang)

  const products = (category.products ?? []).filter(
    (item): item is (typeof category.products)[number] & {title: string; slug: string} =>
      Boolean(item?._id && item.title && item.slug),
  )

  const {title, description} = category
  const categoryTitle = title ?? ''
  const categoryHref = localizedPath(lang, productCategoryPath(category.slug))
  const otherCategoryItems = (otherCategories ?? [])
    .filter((item): item is typeof item & {title: string; slug: string} =>
      Boolean(item?._id && item.title && item.slug),
    )
    .map((otherCategory) => ({
      _id: otherCategory._id,
      title: otherCategory.title,
      href: productCategoryPath(otherCategory.slug),
      subtitle: otherCategory.excerpt,
      image: otherCategory.mainImage,
    }))

  return (
    <div className="container">
      <GridContainer>
        <GridColumn
          span={6}
          className="lg:self-start lg:sticky lg:top-(--header-height) lg:grid lg:grid-rows-[1fr_14svh] lg:min-h-[calc(100svh-var(--header-height))]"
        >
          <GridBlock borders="none" className="relative">
            <PageMainMedia
              className="lg:absolute lg:inset-10"
              mainImage={category.mainImage}
              title={categoryTitle}
            />
          </GridBlock>
          <ScrollCue />
        </GridColumn>
        <GridColumn className="lg:sticky">
          <GridBlock className="pb-0 lg:pb-0">
            <PageHeroText
              title={categoryTitle}
              description={description ? toPortableTextBlocks(description) : null}
            />
          </GridBlock>

          {products.length > 0 &&
            products.map((product) => (
              <ProductCard
                className="last:border-b-0 "
                key={product._id}
                href={productPath(category.slug, product.slug)}
                title={product.title}
                image={product.mainImage}
              />
            ))}
        </GridColumn>
      </GridContainer>
      <QuoteCtaSection
        className="border-t-site border-black dark:border-white"
        formColumnClassName="top-(--header-height) bg-white dark:bg-black"
        form={formConfig}
        lang={lang}
        context={{title: title || undefined, url: categoryHref}}
        aside={otherCategoryItems.length > 0 ? <OtherProducts items={otherCategoryItems} /> : null}
      />
    </div>
  )
}
