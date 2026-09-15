import type {Metadata, ResolvingMetadata} from 'next'
import {notFound, permanentRedirect} from 'next/navigation'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import ContentBlocks from '@/app/components/page-builder/ContentBlocks'
import ProjectContent from '@/app/components/project/ProjectContent.client'
import ProjectMeta from '@/app/components/project/ProjectMeta'
import ProjectCarousel from '@/app/components/project/ProjectCarousel.client'
import ProjectHeroVideo from '@/app/components/project/ProjectHeroVideo.client'
import Image from '@/app/components/ui/SanityImage.client'
import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapAllProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import {sanityFetch} from '@/sanity/lib/live'
import {otherProjectsQuery, projectDetailQuery, projectSlugs} from '@/sanity/lib/queries'
import {
  resolveMetaTitle,
  resolveOpenGraphImage,
  toMetaDescription,
  toPortableTextBlocks,
} from '@/sanity/lib/utils'
import ArrowButton from '@/app/components/ui/ArrowButton'
import PageTitle from '@/app/components/ui/PageTitle'

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
  const t = getDictionary(lang)
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
  const productRefs = project.products?.map((product) => product._id).filter(Boolean) ?? []
  const {data: otherProjectsRaw} =
    productRefs.length > 0
      ? await sanityFetch({
          query: otherProjectsQuery,
          params: {lang, currentId: project._id, productRefs},
        })
      : {data: []}

  const otherProjects = (otherProjectsRaw ?? [])
    .filter((item): item is (typeof otherProjectsRaw)[number] & {title: string} =>
      Boolean(item.title),
    )
    .map(mapAllProjectItemToProjectCardData)

  return (
    <>
      <div className="space-y-10 lg:space-y-16 mb-20 container mt-5 ">
        <div className="aspect-video lg:pb-5 px-5 lg:px-10">
          {heroPlaybackId ? (
            <ProjectHeroVideo playbackId={heroPlaybackId} title={title} />
          ) : mainImage?.asset?._ref ? (
            <Image
              className="h-full w-full rounded-sm object-cover"
              id={mainImage.asset._ref}
              alt=""
              aria-hidden="true"
              width={1200}
              height={675}
              mode="cover"
              hotspot={mainImage.hotspot}
              crop={mainImage.crop}
              preview={mainImage.lqip ?? undefined}
            />
          ) : (
            <div className="h-full w-full bg-black/5 dark:bg-white/5" />
          )}
        </div>
        <ProjectContent
          title={
            <PageTitle className="whitespace-pre-line text-left px-0 lg:text-[clamp(2rem,5vw,4rem)]">
              {title}
            </PageTitle>
          }
          value={toPortableTextBlocks(description)}
        >
          <ProjectMeta products={project.products} />
        </ProjectContent>
      </div>
      <div className="my-16 lg:my-24 container">
        <ContentBlocks blocks={project.pageBuilder ?? []} />
      </div>

      {otherProjects.length > 0 && (
        <section className="relative flex flex-col space-y-10 lg:px-10 mb-16 lg:mb-20">
          <ProjectCarousel
            items={otherProjects}
            header={
              <h2 className="text-center text-[8vw] lg:text-[5vw] font-bold uppercase leading-none tracking-tight">
                {t['sections.otherWork']}
              </h2>
            }
            cta={
              <ArrowButton href="/projects" variant="primary">
                {t['actions.allWork']}
              </ArrowButton>
            }
          />
        </section>
      )}
    </>
  )
}
