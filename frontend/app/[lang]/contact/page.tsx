import type {Metadata} from 'next'

import FaqSection from '@/app/components/contact/FaqSection'
import ProcessSteps from '@/app/components/contact/ProcessSteps'
import QuoteFlowSection from '@/app/components/forms/QuoteFlowSection'
import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import PageTitle from '@/app/components/ui/PageTitle'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {localizedPath, type Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {sanityFetch} from '@/sanity/lib/live'
import {contactPageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: contactPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/contact'),
  } satisfies Metadata
}

/**
 * The full quote page: the multi-step quote form, what happens after sending it,
 * and an FAQ. The short contact form that closes other pages is
 * not repeated here, and office addresses stay in the footer.
 */
export default async function ContactPage({params}: Props) {
  const {lang} = await params
  const t = getDictionary(lang)
  // The form config is fetched without visual-editing markers: its labels feed the
  // letter-by-letter reveal and its option values end up in the notification email.
  const [{data: page}, form] = await Promise.all([
    sanityFetch({query: contactPageQuery, params: {lang}}),
    fetchFormConfigByKey('quote-request', lang),
  ])

  const processSteps = page?.processSteps ?? []
  const faq = page?.faq ?? []
  return (
    <div className="container">
      <GridContainer columns="none">
        <GridColumn span="full">
          <header>
            <h1 className="sr-only">{page?.title}</h1>
            {page?.headline ? <PageTitle as="p">{page.headline}</PageTitle> : null}
          </header>
        </GridColumn>
      </GridContainer>

      <GridContainer columns="none" className="border-y-site border-black dark:border-white">
        <GridColumn span="full">
          <QuoteFlowSection
            form={form}
            lang={lang}
            context={{title: page?.title ?? undefined, url: localizedPath(lang, '/contact')}}
          />
        </GridColumn>
      </GridContainer>

      {processSteps.length > 0 ? (
        <GridContainer columns="none" className="border-b-site border-black dark:border-white">
          <GridColumn span="full" className="border-b-site border-black dark:border-white">
            <SectionHeading className="pb-5 lg:pb-10">
              {page?.processHeading || t['contact.processHeading']}
            </SectionHeading>
          </GridColumn>
          <GridColumn span="full">
            <ProcessSteps steps={processSteps} />
          </GridColumn>
        </GridContainer>
      ) : null}

      {faq.length > 0 ? (
        <GridContainer columns={[4, 8]} className="border-b-site border-black dark:border-white">
          <GridColumn
            span={4}
            className="max-lg:border-b-site border-black dark:border-white lg:sticky lg:top-(--header-height) self-start"
          >
            <SectionHeading className="pb-5 lg:pb-10">
              {page?.faqHeading || t['contact.faqHeading']}
            </SectionHeading>
          </GridColumn>
          <GridColumn span={8}>
            <FaqSection items={faq} />
          </GridColumn>
        </GridContainer>
      ) : null}
    </div>
  )
}
