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
import SectionTitle from '@/app/components/ui/SectionTitle'
import {ProductMainMedia} from './ProductMainMedia'
import ProductCard from './ProductCard'
import ProductHeroText from './ProductMainText'
import GridContainer from '@/app/components/ui/GridContainer'

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

  return (
    <div className="container">
      <GridContainer className="">
        <div className="col-span-6 grid grid-rows-[auto_14svh] self-start sticky top-0 h-svh">
          <div className="p-10 relative">
            <ProductMainMedia
              className="absolute inset-10"
              mainImage={category.mainImage}
              title={categoryTitle}
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
          <div className="p-10  border-b-4 border-black dark:border-white">
            <ProductHeroText
              title={categoryTitle}
              tagline={category.tagline}
              description={description ? toPortableTextBlocks(description) : null}
            />
          </div>
          {products.length > 0 && (
            <>
              {products.map((product) => (
                <ProductCard
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
      </GridContainer>
      <GridContainer variant="compact">
        <div className="col-span-6">
          {(otherCategories ?? [])
            .filter((item): item is typeof item & {title: string; slug: string} =>
              Boolean(item?._id && item.title && item.slug),
            )
            .map((otherCategory) => (
              <ProductCard
                className="last:border-b-0 first:pt-0"
                key={otherCategory._id}
                href={productCategoryPath(otherCategory.slug)}
                title={otherCategory.title}
                excerpt={otherCategory.tagline}
                image={otherCategory.mainImage}
              />
            ))}
        </div>
        <ContactFormSection
          className="p-10 col-span-6 self-start sticky top-0"
          form={formConfig}
          context={{title: categoryTitle || undefined, url: categoryHref}}
          heading={<SectionTitle as="h2">Get An Instant Quote</SectionTitle>}
        />
      </GridContainer>
    </div>
  )
}
