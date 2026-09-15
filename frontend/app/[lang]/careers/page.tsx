import type {Metadata} from 'next'

import BenefitsCarousel from '@/app/components/careers/BenefitsCarousel.client'
import CareersIntro from '@/app/components/careers/CareersIntro'
import JobOpenings from '@/app/components/careers/JobOpenings.client'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {careersPageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: careersPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/careers'),
  } satisfies Metadata
}

export default async function CareersPage({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: careersPageQuery, params: {lang}})

  return (
    <div className="-mt-20 mb-20 space-y-8">
      <header>
        <h1 className="sr-only">{page?.title ?? 'Careers'}</h1>
      </header>
      <CareersIntro intro={page?.intro ?? null} mainImage={page?.mainImage ?? null} />
      <BenefitsCarousel benefits={page?.benefits} />
      <JobOpenings openings={page?.jobOpenings} applyEmail={page?.applyEmail} />
    </div>
  )
}
