import type {Metadata} from 'next'

import PageTitle from '@/app/components/ui/PageTitle'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {blogPageQuery, allPostsQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'
import {Post} from './Post'
import {GridBlock, GridColumn, GridContainer} from '@/app/components/ui/GridSystem'

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

  const visiblePosts = (posts ?? []).filter((post) => Boolean(post.title && post.slug))

  return (
    <div className="container">
      <PageTitle className="hidden" as="h1">
        {page?.title ?? 'Our Blog'}
      </PageTitle>
      <GridContainer columns={[4, 4, 4]}>
        <GridColumn span={'full'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <GridBlock key={post._id}>
              <Post post={post} />
            </GridBlock>
          ))}
        </GridColumn>
      </GridContainer>
    </div>
  )
}
