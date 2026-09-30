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
import ContactFormSection from '@/app/components/forms/ContactFormSection'
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
      subtitle: otherCategory.tagline,
      image: otherCategory.mainImage,
    }))

  return (
    <div className="container">
      <GridContainer variant="compact">
        <GridColumn
          span={6}
          className="self-start sticky top-0 grid grid-rows-[1fr_14svh] min-h-svh"
        >
          <GridBlock borders="none" className="p-10 relative">
            <PageMainMedia
              className="absolute inset-10"
              mainImage={category.mainImage}
              title={categoryTitle}
            />
          </GridBlock>
          <ScrollCue />
        </GridColumn>
        <GridColumn className="sticky">
          <GridBlock className="pb-0">
            <PageHeroText
              title={categoryTitle}
              tagline={category.tagline}
              description={description ? toPortableTextBlocks(description) : null}
            />
          </GridBlock>
          <div>
            <div className="p-10 pb-0">
              <TextReveal
                className="text-4xl leading-tight font-bold"
                text={`Stylish, simplistic and understated. Photobooths will never go out of fashion.`}
              />
            </div>
            {products.length > 0 && (
              <>
                {products.map((product) => (
                  <ProductCard
                    className="last:border-b-0"
                    key={product._id}
                    href={productPath(category.slug, product.slug)}
                    title={product.title}
                    excerpt={product.excerpt}
                    image={product.mainImage}
                  />
                ))}
              </>
            )}
          </div>
        </GridColumn>
      </GridContainer>
      <GridContainer className="max-lg:grid-cols-1 max-lg:after:hidden border-t-site border-black dark:border-white">
        <GridColumn
          span={8}
          className="min-w-0 max-lg:contents sticky top-0 self-start bg-white z-100 border-e-site border-black dark:border-white"
        >
          <ContactFormSection
            className=" max-lg:order-4 h-full flex-col flex"
            form={formConfig}
            context={{title: title || undefined, url: categoryHref}}
            title="Tell us the vision, we bring the setup, the tech, the vibe and the results. Get an Instant Quote."
          />
        </GridColumn>
        <GridColumn span={4} className="max-lg:contents">
          {otherCategoryItems.length > 0 ? <OtherProducts items={otherCategoryItems} /> : null}
        </GridColumn>
      </GridContainer>
    </div>
  )
}
