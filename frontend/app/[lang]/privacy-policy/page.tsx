import type {Metadata} from 'next'

import PageTitle from '@/app/components/ui/PageTitle'
import CustomPortableText from '@/app/components/ui/PortableText'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {privacyPolicyPageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle, toPortableTextBlocks} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: privacyPolicyPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/privacy-policy'),
  } satisfies Metadata
}

export default async function PrivacyPolicyPage({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: privacyPolicyPageQuery, params: {lang}})
  const blocks = toPortableTextBlocks(page?.body)

  return (
    <div className="mt-10 lg:-mt-20 min-h-[calc(100vh-var(--header-height))]">
      <header>
        <PageTitle as="h1">{page?.title}</PageTitle>
      </header>
      <div className="container flex flex-col justify-center items-center py-10 lg:py-20">
        {blocks.length > 0 && <CustomPortableText value={blocks} />}
      </div>
    </div>
  )
}
