import type {Metadata} from 'next'

import PageTitle from '@/app/components/ui/PageTitle'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {blogPageQuery, allPostsQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'
import YearGroupedPosts from './YearGroupedPosts.client'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: blogPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/blog'),
    openGraph: {
      title: page?.seo?.metaTitle ?? page?.title ?? undefined,
    },
  } satisfies Metadata
}

export default async function BlogPage({params}: Props) {
  const {lang} = await params
  const [{data: page}, {data: posts}] = await Promise.all([
    sanityFetch({query: blogPageQuery, params: {lang}}),
    sanityFetch({query: allPostsQuery, params: {lang}}),
  ])

  const currentYear = new Date().getFullYear()

  const groups = Object.entries(
    (posts ?? [])
      .filter((post): post is (typeof posts)[number] & {title: string; slug: string} =>
        Boolean(post.title && post.slug),
      )
      .reduce<Record<number, NonNullable<typeof posts>>>((acc, post) => {
        const year = post.date ? new Date(post.date).getFullYear() : currentYear
        ;(acc[year] ??= []).push(post)
        return acc
      }, {}),
  )
    .map(([year, yearPosts]) => ({year: Number(year), posts: yearPosts}))
    .sort((a, b) => b.year - a.year)

  return (
    <div className="mt-10 lg:-mt-20 min-h-screen">
      <PageTitle as="h1">{page?.title ?? 'Our Blog'}</PageTitle>
      <div className="px-5 lg:px-10">
        <aside className="py-12 sm:py-20">
          <YearGroupedPosts groups={groups} currentYear={currentYear} />
        </aside>
      </div>
    </div>
  )
}
