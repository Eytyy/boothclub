import type {Metadata, ResolvingMetadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapAllProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {
  otherProjectsQuery,
  projectDetailQuery,
  projectSlugs,
  relatedPostsQuery,
} from '@/sanity/lib/queries'
import {
  resolveMetaTitle,
  resolveOpenGraphImage,
  toMetaDescription,
  toPortableTextBlocks,
} from '@/sanity/lib/utils'
import type {OtherProjectsQueryResult} from '@/sanity.types'
import {GridContainer, GridBlock, GridColumn} from '@/app/components/ui/GridSystem'
import {PageMainMedia} from '@/app/components/page/PageMainMedia'
import PageHeroText from '@/app/components/page/PageHeroText'
import ProjectGallery from './ProjectGallery.client'
import CopyBlock from '@/app/components/product/CopyBlock'
import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import ContactFormSection from '@/app/components/forms/ContactFormSection'
import OtherProducts from '@/app/components/product/OtherProducts.client'
import RelatedPosts from '@/app/components/blog/RelatedPosts'
import {mapRelatedPosts} from '@/app/components/blog/mapRelatedPosts'

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

  const documentId = project._id.replace(/^drafts\./, '')
  const [otherProjectsResult, relatedPostsResult, formConfig] = await Promise.all([
    productId
      ? sanityFetch({
          query: otherProjectsQuery,
          params: {lang, currentId: project._id, productId},
        })
      : Promise.resolve({data: [] as OtherProjectsQueryResult}),
    sanityFetch({
      query: relatedPostsQuery,
      params: {lang, documentId},
    }),
    fetchFormConfigByKey('contact-us', lang),
  ])

  const otherProjects = (otherProjectsResult.data ?? [])
    .filter((item): item is (typeof otherProjectsResult.data)[number] & {title: string} =>
      Boolean(item.title),
    )
    .map(mapAllProjectItemToProjectCardData)
  const relatedPosts = mapRelatedPosts(relatedPostsResult.data)

  const galleryItems = (project.gallery ?? []).map((item) => ({
    id: item._key,
    image: item,
    width: item.dimensions?.width ?? undefined,
    height: item.dimensions?.height ?? undefined,
  }))
  const blocks = project.blocks ?? []
  const outputItems = (project.output ?? []).filter((item) => item.asset?._ref)
  const hasBlocks = blocks.length > 0

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
        {hasBlocks ? (
          <GridContainer>
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
          <GridContainer columns={[4, 4, 4]} className="relative">
            {outputItems.map((item) => (
              <GridBlock
                key={item._key}
                borders={hasBlocks ? 'none' : 'top'}
                className="col-span-4 bg-white dark:bg-black relative z-40"
              >
                <MediaItem media={{type: 'image', image: item}} />
              </GridBlock>
            ))}
          </GridContainer>
        ) : null}
        {relatedPosts.length > 0 ? (
          <GridContainer columns="none">
            <GridColumn span="full" className="border-t-site border-black dark:border-white">
              <RelatedPosts posts={relatedPosts} />
            </GridColumn>
          </GridContainer>
        ) : null}
        <GridContainer
          columns={[8, 4]}
          className="max-lg:grid-cols-1 max-lg:[&_.grid-divider]:hidden border-t-site border-black dark:border-white"
        >
          <GridColumn
            span={8}
            className="min-w-0 max-lg:contents sticky top-0 self-start bg-white z-100"
          >
            <ContactFormSection
              className=" max-lg:order-4 h-full flex-col flex"
              form={formConfig}
              context={{title: title || undefined, url: projectHref}}
              title="Tell us the vision, we bring the setup, the tech, the vibe and the results. Get an Instant Quote."
            />
          </GridColumn>
          <GridColumn span={4} className="max-lg:contents">
            {otherProjects.length > 0 ? (
              <OtherProducts
                items={otherProjects.map((p) => ({
                  _id: p._id,
                  title: p.title,
                  href: `/projects/${p.slug}`,
                  image: p.mainImage,
                }))}
              />
            ) : null}
          </GridColumn>
        </GridContainer>
      </div>
    </div>
  )
}
