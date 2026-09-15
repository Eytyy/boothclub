import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'

import Avatar from '@/app/components/ui/Avatar'
import ArrowButton from '@/app/components/ui/ArrowButton'
import PostsCarousel from '@/app/components/blog/PostsCarousel.client'
import PortableText from '@/app/components/ui/PortableText'
import Image from '@/app/components/ui/SanityImage.client'
import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage, toPortableTextBlocks} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale; slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return locales.flatMap((lang) =>
    (data ?? [])
      .filter((item): item is {slug: string} => Boolean(item.slug))
      .map(({slug}) => ({lang, slug})),
  )
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const {lang, slug} = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params: {lang, slug},
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)
  const authorName = post?.author?.name

  return {
    alternates: {
      ...localeAlternates(lang, `/blog/${slug}`),
      canonical: post?.canonicalUrl || localizedPath(lang, `/blog/${slug}`),
    },
    authors: authorName ? [{name: authorName}] : [],
    title: post?.meta?.title || post?.title || undefined,
    description: post?.meta?.description || post?.excerpt || undefined,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const {lang, slug} = await props.params
  const {data: post} = await sanityFetch({query: postQuery, params: {lang, slug}})
  const authorName = post?.author?.name

  if (!post?._id || !post.title || !post.slug) {
    return notFound()
  }

  const categoryIds =
    post.categories?.map((c) => c._id).filter((id): id is string => Boolean(id)) ?? []

  const {data: morePosts} = await sanityFetch({
    query: morePostsQuery,
    params: {lang, skip: post._id, categoryIds, limit: 4},
  })

  const morePostsWithTitle = (morePosts ?? []).filter(
    (item): item is (typeof morePosts)[number] & {title: string; slug: string} =>
      Boolean(item.title && item.slug),
  )

  return (
    <>
      <div className="grid gap-10 px-5 lg:px-10 lg:-mt-20">
        <div className="grid gap-10 grid-cols-1  max-w-4xl mx-auto ">
          <div className="relative overflow-hidden rounded-sm aspect-video">
            {post?.coverImage && (
              <Image
                id={post.coverImage.asset?._ref || ''}
                alt={post.coverImage.alt || ''}
                className="w-full h-full object-cover"
                width={1000}
                height={600}
                mode="cover"
                hotspot={post.coverImage.hotspot}
                crop={post.coverImage.crop}
                preview={post.coverImage.lqip ?? undefined}
              />
            )}
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold">{post.title}</h1>
            {post.author && authorName ? <Avatar person={post.author} date={post.date} /> : null}
          </div>
          <article className="gap-6 grid article-content">
            {post.content?.length && (
              <PortableText
                className="max-w-full prose-headings:font-medium prose-headings:tracking-tight"
                value={toPortableTextBlocks(post.content)}
              />
            )}
          </article>
          {post.blogPostFooter?.length ? (
            <footer className="article-content border-t border-black/10 dark:border-white/10 pt-8 mb-12">
              <PortableText
                className="max-w-full "
                value={toPortableTextBlocks(post.blogPostFooter)}
              />
            </footer>
          ) : null}
        </div>
      </div>
      {morePostsWithTitle.length > 0 && (
        <section className="relative flex flex-col space-y-10 lg:px-10 mb-16 lg:mb-20 mt-10 lg:mt-20">
          <PostsCarousel
            items={morePostsWithTitle}
            header={
              <h2 className="text-center text-[5vw] font-bold uppercase leading-none tracking-tight">
                Recent Posts
              </h2>
            }
            cta={
              <ArrowButton href="/blog" variant="primary">
                All posts
              </ArrowButton>
            }
          />
        </section>
      )}
    </>
  )
}
