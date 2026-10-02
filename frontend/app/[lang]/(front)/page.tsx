import type {Metadata} from 'next'

import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle, resolveOpenGraphImage} from '@/sanity/lib/utils'
import JsonLd from '@/app/components/seo/JsonLd'
import {buildHomeStructuredData} from '@/app/lib/seo/structuredData'
import TextReveal from '@/app/components/ui/TextReveal.client'
import HomeHero from './Hero.client'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: homePageQuery,
    params: {lang},
    stega: false,
  })

  const seo = page?.seo
  const ogImage = resolveOpenGraphImage(seo?.metaImage)

  return {
    title: resolveMetaTitle(seo?.metaTitle),
    description: seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/'),
    openGraph: ogImage ? {images: [ogImage]} : undefined,
  } satisfies Metadata
}

export default async function Page({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: homePageQuery, params: {lang}})

  return (
    <div className="">
      <JsonLd data={buildHomeStructuredData(process.env.NEXT_PUBLIC_SITE_URL, lang)} />
      <div className="container">
        <div className="mx-10  border-x-site">
          <div className="p-10">
            <HomeHero />
          </div>
          <div className="border-t-site grid gap-10 p-10">
            <h2 className="text-lg font-semibold uppercase lg:pb-0 flex items-center gap-5">
              <span className="block w-4 h-4 bg-black dark:bg-white"></span>
              Our Products
            </h2>
            <TextReveal
              className="text-reveal-compact font-bold"
              text="Glambot, AI portraits and custom-built booths for store openings, activations and celebrations. Designed around your brand, run by our crew, measured after."
            />
            <div className="grid grid-cols-3 gap-10">
              <ProductCard
                title="Local rentals"
                description="Local rentals for your brand. From AI portraits to custom-built booths, we have you covered."
              />
              <ProductCard
                title="Permenant Installations"
                description="Permenant installations for your brand. From AI portraits to custom-built booths, we have you covered."
              />
              <ProductCard
                title="Interactive Experiences"
                description="Interactive experiences for your brand. From AI portraits to custom-built booths, we have you covered."
              />
            </div>
          </div>
          <div className="p-10">Clients scroll</div>
          <div className="p-10">1 Project Highlight</div>
          <div className="p-10">3 Featured blog posts Scroll</div>
          <div className="p-10">Contact Form + Statement "maybe steps of how it works"</div>
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({title, description}: {title: string; description: string}) => {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden relative group cursor-pointer">
        <div className="overflow-hidden">
          <div className="aspect-square w-full bg-black dark:bg-white" />
        </div>
        <header className="absolute bottom-0 left-0  pt-7 pr-8 bg-white dark:bg-black">
          <h3 className="text-3xl font-semibold">{title}</h3>
        </header>
        <div className="absolute top-0 right-0 p-5 bg-white dark:bg-black font-bold text-2xl group-hover:opacity-100 opacity-0 ">
          &rarr;
        </div>
      </div>
      <p>{description}</p>
    </div>
  )
}
