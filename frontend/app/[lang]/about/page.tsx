import type {Metadata} from 'next'

import PageBuilder from '@/app/components/page-builder/PageBuilder.client'
import PageTitle from '@/app/components/ui/PageTitle'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutPageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: aboutPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? page?.headline ?? undefined,
    alternates: localeAlternates(lang, '/about'),
  } satisfies Metadata
}

export default async function AboutPage({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: aboutPageQuery, params: {lang}})

  return (
    <div className="mt-10 lg:-mt-20">
      <header>
        <h1 className="sr-only">{page?.title}</h1>
        <PageTitle as="p">{page?.headline}</PageTitle>
      </header>
      <PageBuilder page={page} />
    </div>
  )
}
