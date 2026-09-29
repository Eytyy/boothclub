import type {Metadata, ResolvingMetadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapAllProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {otherProjectsQuery, projectDetailQuery, projectSlugs} from '@/sanity/lib/queries'
import {
  resolveMetaTitle,
  resolveOpenGraphImage,
  toMetaDescription,
  toPortableTextBlocks,
} from '@/sanity/lib/utils'
import type {OtherProjectsQueryResult} from '@/sanity.types'
import {GridContainer, GridBlock, GridColumn} from '@/app/components/ui/GridSystem'
import SectionTitle from '@/app/components/ui/SectionTitle'
import {PageMainMedia} from '@/app/components/page/PageMainMedia'
import PageHeroText from '@/app/components/page/PageHeroText'
import ProjectGallery from './ProjectGallery.client'
import CopyBlock from '@/app/components/product/CopyBlock'
import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import FeaturedProjects from '@/app/components/project/FeaturedProjects.client'
import ContactFormSection from '@/app/components/forms/ContactFormSection'
import SectionTitleMarquee from '@/app/components/ui/SectionTitleMarquee'

type Props = {
  params: Promise<{lang: Locale; slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: projectSlugs,
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
  const {data: project} = await sanityFetch({
    query: projectDetailQuery,
    params: {lang, slug},
    stega: false,
  })

  const seo = project?.seo
  const ogImage =
    resolveOpenGraphImage(seo?.metaImage) ??
    resolveOpenGraphImage(project?.mainImage as SanityImageSource | undefined)
  const description = seo?.metaDescription || toMetaDescription(project?.description)
  const parentMetadata = await parent
  const parentOgImages = parentMetadata.openGraph?.images ?? []

  return {
    title: resolveMetaTitle(seo?.metaTitle, project?.title),
    description: description || undefined,
    alternates: localeAlternates(lang, `/projects/${slug}`),
    openGraph: {
      images: ogImage ? [ogImage] : parentOgImages,
    },
  } satisfies Metadata
}

export default async function ProjectDetailPage(props: Props) {
  const {lang, slug} = await props.params
  const {data: project} = await sanityFetch({
    query: projectDetailQuery,
    params: {lang, slug},
  })

  if (!project?._id || !project.title || !project.slug) {
    return notFound()
  }

  if (project.slug !== slug) {
    permanentRedirect(localizedPath(lang, `/projects/${project.slug}`))
  }

  const {title, mainImage, heroVideo, description} = project
  const heroPlaybackId =
    heroVideo != null &&
    typeof heroVideo === 'object' &&
    'playbackId' in heroVideo &&
    typeof heroVideo.playbackId === 'string' &&
    heroVideo.playbackId.length > 0
      ? heroVideo.playbackId
      : null
  const productId = project.product?._id
  const projectHref = localizedPath(lang, `/projects/${project.slug}`)

  const [otherProjectsResult, formConfig] = await Promise.all([
    productId
      ? sanityFetch({
          query: otherProjectsQuery,
          params: {lang, currentId: project._id, productId},
        })
      : Promise.resolve({data: [] as OtherProjectsQueryResult}),
    fetchFormConfigByKey('contact-us', lang),
  ])

  const otherProjects = (otherProjectsResult.data ?? [])
    .filter((item): item is (typeof otherProjectsResult.data)[number] & {title: string} =>
      Boolean(item.title),
    )
    .map(mapAllProjectItemToProjectCardData)

  const galleryItems = (project.gallery ?? []).map((item) => ({
    id: item._key,
    image: item,
  }))
  const blocks = project.blocks ?? []
  const outputItems = (project.output ?? []).filter((item) => item.asset?._ref)

  return (
    <div className="container grid">
      <div className="col-start-1 row-start-1">
        <GridContainer>
          <GridColumn span={6} className="grid self-start sticky top-0 h-svh">
            <GridBlock className="p-10 relative">
              <PageMainMedia
                className="absolute inset-10"
                mainImage={mainImage}
                title={title ?? ''}
                heroPlaybackId={heroPlaybackId}
              />
            </GridBlock>
          </GridColumn>
          <GridColumn span={6} className="sticky">
            <GridBlock borders="bottom">
              <PageHeroText
                title={title ?? ''}
                description={description ? toPortableTextBlocks(description) : null}
              />
            </GridBlock>
            {galleryItems.length > 0 ? (
              <GridBlock className="col-span-6 p-0">
                <ProjectGallery items={galleryItems} />
              </GridBlock>
            ) : null}
          </GridColumn>
        </GridContainer>
        {blocks.length > 0 ? (
          <GridContainer variant="compact">
            {blocks.map((block, index) => {
              const isLastOdd = index === blocks.length - 1 && blocks.length % 2 === 1
              const spanClass = isLastOdd
                ? 'col-span-12 relative z-10 bg-white dark:bg-black'
                : 'col-span-6'

              if (block._type === 'block.copy') {
                return (
                  <div key={block._key} className={spanClass}>
                    <CopyBlock
                      className="border-y-site border-black dark:border-white"
                      showHeadline={block.showHeadline ?? undefined}
                      showText={block.showText ?? undefined}
                      headline={block.headline ?? undefined}
                      text={block.text ?? undefined}
                    />
                  </div>
                )
              }

              return (
                <div key={block._key} className={`${spanClass} p-10`}>
                  <MediaItem media={block} aspect="video" />
                </div>
              )
            })}
          </GridContainer>
        ) : null}
        {outputItems.length > 0 ? (
          <GridContainer variant="compact" className="relative">
            <SectionTitle className="absolute top-0 left-0 z-100">Output</SectionTitle>
            {outputItems.map((item) => (
              <GridBlock
                key={item._key}
                borders="bottom-right"
                className="col-span-4 last:border-e-0 bg-white dark:bg-black relative z-40 pt-28"
              >
                <MediaItem media={{type: 'image', image: item}} />
              </GridBlock>
            ))}
          </GridContainer>
        ) : null}
        <GridContainer variant="compact" className="max-lg:grid-cols-1 max-lg:after:hidden ">
          <GridColumn span={6} className="min-w-0 max-lg:contents">
            <ContactFormSection
              className=" max-lg:order-4 h-full flex-col flex"
              form={formConfig}
              context={{title: title || undefined, url: projectHref}}
              title="Get an Instant Quote"
            />
          </GridColumn>
          <GridColumn span={6} className="max-lg:contents">
            {otherProjects.length > 0 ? (
              <FeaturedProjects
                className="border-b-0"
                heading="related projects"
                items={otherProjects}
                lang={lang}
              />
            ) : null}
          </GridColumn>
        </GridContainer>
      </div>
    </div>
  )
}
