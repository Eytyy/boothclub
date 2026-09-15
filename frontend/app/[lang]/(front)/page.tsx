import type {Metadata} from 'next'

import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import type {HeroProps} from './Hero.client'
import PageBuilder from '@/components/page-builder/PageBuilder.client'
import {mapHomeFeaturedProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import type {ProjectCardData} from '@/app/components/project/types'
import {resolveMetaTitle, resolveOpenGraphImage} from '@/sanity/lib/utils'
import JsonLd from '@/app/components/seo/JsonLd'
import {buildHomeStructuredData} from '@/app/lib/seo/structuredData'
import Hero from './Hero.client'

type PageData = Awaited<ReturnType<typeof sanityFetch<typeof homePageQuery>>>['data']

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

function resolveHeroProps(page: PageData): HeroProps {
  const hero = page?.hero
  if (!hero) {
    return {headline: ''}
  }

  return {
    headline: hero.headline ?? '',
    subheadline: hero.subheadline ?? undefined,
    playbackId: hero.video && 'playbackId' in hero.video ? (hero.video.playbackId ?? null) : null,
    taglineWithVideo: hero.taglineWithVideo ?? undefined,
  }
}

function resolveFeaturedProjectItems(page: PageData): ProjectCardData[] {
  const items = page?.featuredProjects?.items
  if (!items?.length) return []
  return items
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map(mapHomeFeaturedProjectItemToProjectCardData)
    .filter((item) => Boolean(item.mainImage?.asset?._ref))
}

export default async function Page({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: homePageQuery, params: {lang}})
  const heroProps = resolveHeroProps(page)
  const featuredProjectItems = resolveFeaturedProjectItems(page)

  return (
    <div className="">
      <JsonLd data={buildHomeStructuredData(process.env.NEXT_PUBLIC_SITE_URL, lang)} />
      {/* <Hero {...heroProps} featuredProjectItems={featuredProjectItems} /> */}
      <PageBuilder page={page} />
    </div>
  )
}
