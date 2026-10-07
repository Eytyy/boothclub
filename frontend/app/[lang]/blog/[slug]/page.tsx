import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {stegaClean} from '@sanity/client/stega'

import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {adjacentPostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import type {AdjacentPostsQueryResult, PostQueryResult} from '@/sanity.types'

import AdjacentPosts from './AdjacentPosts'
import PostBody from './PostBody'
import PostHero from './PostHero'
import TaggedInArticle, {type TaggedLink} from './TaggedInArticle'

type Props = {
  params: Promise<{lang: Locale; slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
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
  const {data: post} = await sanityFetch({
    query: postQuery,
    params: {lang, slug},
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    alternates: {
      ...localeAlternates(lang, `/blog/${slug}`),
      canonical: localizedPath(lang, `/blog/${slug}`),
    },
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

  if (!post?._id || !post.title || !post.slug) {
    return notFound()
  }

  const {data: adjacent} = await sanityFetch({
    query: adjacentPostsQuery,
    params: {lang, date: post.date, id: post._id},
  })

  const taggedLinks = extractTaggedLinks(post.sections)
  const previousPost = usableAdjacentPost(adjacent?.previous)
  const nextPost = usableAdjacentPost(adjacent?.next)

  return (
    <div className="container">
      <article data-page-grid className="border-x-site border-black dark:border-white mx-10">
        <div className="p-10 space-y-15">
          <PostHero title={post.title} date={post.date} coverImage={post.coverImage} />
          <PostBody sections={post.sections ?? []} />
        </div>
        <div>
          <TaggedInArticle items={taggedLinks} />
          <AdjacentPosts previous={previousPost} next={nextPost} />
        </div>
      </article>
    </div>
  )
}

type AdjacentPost = NonNullable<AdjacentPostsQueryResult['previous']>

function usableAdjacentPost(
  post: AdjacentPost | null | undefined,
): (AdjacentPost & {title: string; slug: string}) | null {
  if (!post?._id || !post.title || !post.slug) return null
  return post as AdjacentPost & {title: string; slug: string}
}

function extractTaggedLinks(
  sections: NonNullable<PostQueryResult>['sections'] | null | undefined,
): TaggedLink[] {
  const seen = new Set<string>()
  const items: TaggedLink[] = []

  for (const section of sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block._type !== 'post.content') continue
      for (const node of block.content ?? []) {
        if (!('markDefs' in node) || !node.markDefs) continue
        for (const mark of node.markDefs) {
          const tagged = taggedLinkFromMark(mark)
          if (!tagged || seen.has(tagged.id)) continue
          seen.add(tagged.id)
          items.push(tagged)
        }
      }
    }
  }

  return items
}

function taggedLinkFromMark(mark: unknown): TaggedLink | null {
  const rec = asRecord(mark)
  if (!rec || rec._type !== 'link') return null

  const linkType = stringField(rec.linkType)
  if (linkType === 'product') {
    const product = asRecord(rec.product)
    const id = stringField(product?._id)
    const title = stringField(product?.title)
    const slug = stringField(product?.slug)
    const categorySlug = stringField(product?.categorySlug)
    if (!id || !title || !slug || !categorySlug) return null
    return {id, kind: 'product', title, href: productPath(categorySlug, slug)}
  }

  if (linkType === 'productCategory') {
    const category = rec.productCategory
    const obj = asRecord(category)
    const id = stringField(obj?._id)
    const title = stringField(obj?.title)
    const slug = stringField(typeof category === 'string' ? category : obj?.slug)
    if (!id || !title || !slug) return null
    return {id, kind: 'productCategory', title, href: productCategoryPath(slug)}
  }

  if (linkType === 'project') {
    const project = asRecord(rec.project)
    const id = stringField(project?._id)
    const title = stringField(project?.title)
    const slug = stringField(project?.slug)
    if (!id || !title || !slug) return null
    return {id, kind: 'project', title, href: `/projects/${slug}`}
  }

  return null
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function stringField(value: unknown): string | null {
  if (typeof value !== 'string') return null
  return stegaClean(value) || null
}
