import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {stegaClean} from '@sanity/client/stega'

import PortableText from '@/app/components/ui/PortableText'
import Image from '@/app/components/ui/SanityImage.client'
import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {adjacentPostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {dataAttr, resolveOpenGraphImage, toPortableTextBlocks} from '@/sanity/lib/utils'
import {GridBlock, GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import PageTitle from '@/app/components/ui/PageTitle'
import type {AdjacentPostsQueryResult, PostQueryResult} from '@/sanity.types'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import PostBody from './PostBody'

type Props = {
  params: Promise<{lang: Locale; slug: string}>
}

type TaggedKind = 'product' | 'productCategory' | 'project'

type TaggedLink = {
  id: string
  kind: TaggedKind
  title: string
  href: string
}

const taggedLabels: Record<TaggedKind, string> = {
  product: 'Product',
  productCategory: 'Category',
  project: 'Project',
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
    <>
      <div className="container">
        <GridContainer columns={[4, 8]}>
          <GridColumn span={4} className="self-start sticky top-0">
            <GridBlock className="relative aspect-square" borders="bottom">
              {post?.coverImage?.asset?._ref ? (
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
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </GridBlock>
            {taggedLinks.length > 0 ? (
              <GridBlock as="aside" className="space-y-5" borders="bottom">
                <h2 className="font-normal">Tagged in this article</h2>
                {taggedLinks.map((item) => (
                  <SidebarEntry
                    key={item.id}
                    href={item.href}
                    label={taggedLabels[item.kind]}
                    title={item.title}
                  />
                ))}
              </GridBlock>
            ) : null}
            <GridBlock className="space-y-5">
              {previousPost ? (
                <SidebarEntry
                  href={`/blog/${previousPost.slug}`}
                  label="Previous"
                  title={previousPost.title}
                  sanity={{id: previousPost._id, type: 'post'}}
                />
              ) : null}
              {nextPost ? (
                <SidebarEntry
                  href={`/blog/${nextPost.slug}`}
                  label="Next"
                  title={nextPost.title}
                  sanity={{id: nextPost._id, type: 'post'}}
                />
              ) : null}
            </GridBlock>
          </GridColumn>
          <GridColumn span={8}>
            <GridBlock>
              <div className="space-y-10">
                <PageTitle>{post.title}</PageTitle>
                <article className="article-content">
                  <PostBody sections={post.sections ?? []} />
                </article>
              </div>
              {post.blogPostFooter?.length ? (
                <footer className="article-content border-t border-black/10 dark:border-white/10 pt-8 mb-12">
                  <PortableText
                    className="max-w-full "
                    value={toPortableTextBlocks(post.blogPostFooter)}
                  />
                </footer>
              ) : null}
            </GridBlock>
          </GridColumn>
        </GridContainer>
      </div>
    </>
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

function SidebarEntry({
  href,
  label,
  title,
  sanity,
}: {
  href: string
  label: string
  title: string
  sanity?: {id: string; type: string}
}) {
  return (
    <article
      data-sanity={
        sanity ? dataAttr({id: sanity.id, type: sanity.type, path: 'title'}).toString() : undefined
      }
      className="rounded-sm flex flex-col justify-start transition-colors relative"
    >
      <LocalizedLink className="underline transition-colors" href={href}>
        <span className="absolute inset-0 z-10" />
      </LocalizedLink>
      <div>
        <p className="text-black/50 dark:text-white/50 text-xs">{label}</p>
        <h3 className="lg:text-2xl font-bold">{title}</h3>
      </div>
    </article>
  )
}
