import type {Metadata} from 'next'

import ContactFormSection from '@/app/components/forms/ContactFormSection'
import BigText from '@/app/components/ui/BigText'
import Image from '@/app/components/ui/SanityImage.client'
import PageTitle from '@/app/components/ui/PageTitle'
import {localizedPath, type Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
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

export default async function ContactPage({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: contactPageQuery, params: {lang}})

  const form = page?.form
  const addressTitle = page?.addressTitle
  const googleMapsUrl = page?.googleMapsUrl
  const mapImage = page?.mapImage
  const showLocationBlock = Boolean(addressTitle || googleMapsUrl || mapImage?.asset?._ref)

  return (
    <div className="mt-10 lg:-mt-20 mb-20 space-y-8">
      <header>
        <h1 className="sr-only">{page?.title}</h1>
        <PageTitle as="p">{page?.headline}</PageTitle>
      </header>
      {form && form.key === 'contact-us' ? (
        <section className="py-12 lg:py-16">
          <ContactFormSection
            form={form}
            context={{
              title: page?.title ?? undefined,
              url: localizedPath(lang, '/contact'),
            }}
          />
          {showLocationBlock ? (
            <div className="container mt-10 lg:mt-20">
              {addressTitle ? (
                <BigText as="h2" className="mb-10">
                  {googleMapsUrl ? (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-inherit no-underline hover:underline"
                    >
                      {addressTitle}
                    </a>
                  ) : (
                    addressTitle
                  )}
                </BigText>
              ) : null}
              {mapImage?.asset?._ref ? (
                googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 aspect-video"
                  >
                    <Image
                      id={mapImage.asset._ref}
                      alt={mapImage.alt ?? ''}
                      hotspot={mapImage.hotspot}
                      crop={mapImage.crop}
                      preview={mapImage.lqip ?? undefined}
                      width={1200}
                      height={675}
                      className="w-full rounded-sm object-cover h-full"
                    />
                  </a>
                ) : (
                  <Image
                    id={mapImage.asset._ref}
                    alt={mapImage.alt ?? ''}
                    hotspot={mapImage.hotspot}
                    crop={mapImage.crop}
                    preview={mapImage.lqip ?? undefined}
                    width={1200}
                    height={675}
                    className="w-full rounded-sm object-cover h-full"
                  />
                )
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
