import type {Metadata} from 'next'
import {stegaClean} from '@sanity/client/stega'
import {format} from 'date-fns'
import {ar} from 'date-fns/locale'

import type {Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {dataAttr, resolveMetaTitle, resolveOpenGraphImage} from '@/sanity/lib/utils'
import type {HomePageQueryResult} from '@/sanity.types'
import JsonLd from '@/app/components/seo/JsonLd'
import {buildHomeStructuredData} from '@/app/lib/seo/structuredData'
import TextReveal from '@/app/components/ui/TextReveal.client'
import {Marquee} from '@/app/components/ui/Marquee.client'
import QuoteFlow from '@/app/components/forms/QuoteFlow.client'
import HomeHero from './Hero.client'
import {GridContainer} from '@/app/components/ui/GridSystem'
import PageTitle from '@/app/components/ui/PageTitle'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import PostMarqueeRow from '@/app/components/blog/PostMarqueeRow'
import ClientLogo from '@/app/components/ui/ClientLogo'
import Image from '@/app/components/ui/SanityImage.client'

type HomePage = NonNullable<HomePageQueryResult>
type ProductCategoryItem = NonNullable<
  NonNullable<HomePage['featuredProducts']>['categories']
>[number]
type FeaturedProjectItem = NonNullable<HomePage['featuredProject']>

/** Short date shown before each post title, e.g. "12 Mar". */
const POST_LABEL_FORMAT = 'd MMM'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: homePageQuery,
    params: {lang},
    stega: false,
  })

  const seo = page?.seo
  const ogImage = resolveOpenGraphImage(seo?.metaImage)

  return {
    title: resolveMetaTitle(seo?.metaTitle),
    description: seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/'),
    openGraph: ogImage ? {images: [ogImage]} : undefined,
  } satisfies Metadata
}

export default async function Page({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: homePageQuery, params: {lang}})
  const t = getDictionary(lang)

  const heroColumns = page?.hero?.columns ?? []
  const featuredProducts = page?.featuredProducts
  const categories = featuredProducts?.categories ?? []
  const clients = (page?.clients ?? []).filter(Boolean)
  const featuredProject = page?.featuredProject
  const posts = (page?.featuredPosts ?? []).filter((post) => Boolean(post.title && post.slug))

  return (
    <div className="">
      <JsonLd data={buildHomeStructuredData(process.env.NEXT_PUBLIC_SITE_URL, lang)} />
      <div className="container">
        <div data-page-grid className="md:mx-10 border-x-site pt-12 md:pt-0">
          {heroColumns.length > 0 && <HomeHero columns={heroColumns} />}
          {featuredProducts && (
            <div className="border-t-site">
              {featuredProducts.headline && (
                <div className="p-5 md:p-10 md:pb-0">
                  <TextReveal
                    className="pointer-events-none text-reveal-default"
                    text={stegaClean(featuredProducts.headline)}
                  />
                </div>
              )}
              <div className="px-5 md:px-10">
                {featuredProducts.description && (
                  <div className="max-w-250 ">
                    <TextReveal
                      className="body-text font-normal"
                      text={stegaClean(featuredProducts.description)}
                    />
                  </div>
                )}
                {categories.length > 0 && (
                  <div className="grid lg:grid-cols-3 gap-10 py-10">
                    {categories.map((category) => (
                      <ProductCategoryCard key={category._id} category={category} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {clients.length > 0 && (
            <div className="border-y-site">
              <Marquee
                speed={70}
                runClassName="mx-0"
                className="h-auto py-8"
                accessibleText={clients
                  .map((client) => client.name)
                  .filter(Boolean)
                  .join(', ')}
              >
                <div className="flex items-center text-2xl font-semibold tracking-tight md:text-4xl">
                  {clients.map((client) => (
                    <div key={client._id} className="px-8">
                      <ClientLogo {...client} />
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          )}
          {featuredProject && <FeaturedProject project={featuredProject} />}
          {posts.length > 0 && (
            <div className="border-b-site border-black dark:border-white">
              <h2 className="flex items-center gap-5 p-5 pb-0 text-lg font-semibold uppercase lg:p-10 lg:pb-0">
                <span className="block h-4 w-4 bg-black dark:bg-white" />
                {t['sections.journal']}
              </h2>
              {posts.map((post, index) => (
                <PostMarqueeRow
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  label={format(
                    new Date(post.date),
                    POST_LABEL_FORMAT,
                    lang === 'ar' ? {locale: ar} : undefined,
                  )}
                  title={post.title ?? ''}
                  index={index}
                  sanity={dataAttr({id: post._id, type: 'post', path: 'title'}).toString()}
                />
              ))}
            </div>
          )}
          <QuoteFlow className="border-t-site" />
        </div>
      </div>
    </div>
  )
}

const ProductCategoryCard = ({category}: {category: ProductCategoryItem}) => {
  const {title, excerpt, slug, mainImage} = category

  return (
    <div className="space-y-5">
      <div className="overflow-hidden relative group">
        <LocalizedLink href={productCategoryPath(slug)} aria-label={title ?? undefined}>
          <span className="absolute inset-0 z-10" />
        </LocalizedLink>
        <div className="overflow-hidden">
          {mainImage?.asset?._ref ? (
            <Image
              id={mainImage.asset._ref}
              alt={mainImage.alt ?? ''}
              width={800}
              height={800}
              mode="cover"
              hotspot={mainImage.hotspot}
              crop={mainImage.crop}
              preview={mainImage.lqip ?? undefined}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="aspect-square w-full bg-black dark:bg-white" />
          )}
        </div>
        <header className="absolute bottom-0 left-0  pt-7 pr-8 bg-white dark:bg-black">
          <h3 className="text-3xl font-semibold">{title}</h3>
        </header>
        <div className="absolute top-0 right-0 p-5 bg-white dark:bg-black font-bold text-2xl group-hover:opacity-100 opacity-0 ">
          &rarr;
        </div>
      </div>
      {excerpt && <p>{excerpt}</p>}
    </div>
  )
}

const FeaturedProject = ({project}: {project: FeaturedProjectItem}) => {
  const {title, slug, mainImage, product, excerpt} = project
  const categorySlug = product?.category?.slug

  return (
    <GridContainer
      columns={[6, 6]}
      className="grid grid-cols-2 gap-10 border-x-0 mx-0 p-0 lg:p-0 lg:mx-0 border-b-site border-black dark:border-white"
    >
      <div className="p-10">
        <LocalizedLink href={`/projects/${slug}`} className="block">
          {mainImage?.asset?._ref ? (
            <Image
              id={mainImage.asset._ref}
              alt={mainImage.alt ?? title ?? ''}
              width={1200}
              height={1200}
              mode="cover"
              hotspot={mainImage.hotspot}
              crop={mainImage.crop}
              preview={mainImage.lqip ?? undefined}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="bg-black aspect-square w-full" />
          )}
        </LocalizedLink>
      </div>
      <div className="p-10">
        <div className="space-y-5 flex flex-col">
          <header className="space-y-2">
            {product?.title && product.slug && categorySlug && (
              <LocalizedLink
                href={productPath(categorySlug, product.slug)}
                className="inline-block text-sm font-semibold uppercase tracking-wide hover:underline"
              >
                {product.title}
              </LocalizedLink>
            )}
            <PageTitle as="h2">
              <LocalizedLink href={`/projects/${slug}`} className="hover:underline">
                {title}
              </LocalizedLink>
            </PageTitle>
          </header>
          {excerpt && (
            <TextReveal className="body-text font-normal text-black" text={stegaClean(excerpt)} />
          )}
        </div>
      </div>
    </GridContainer>
  )
}
