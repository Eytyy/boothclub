import type {Metadata} from 'next'

import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle, resolveOpenGraphImage} from '@/sanity/lib/utils'
import JsonLd from '@/app/components/seo/JsonLd'
import {buildHomeStructuredData} from '@/app/lib/seo/structuredData'
import TextReveal from '@/app/components/ui/TextReveal.client'
import {Marquee} from '@/app/components/ui/Marquee.client'
import HomeHero from './Hero.client'
import {GridContainer} from '@/app/components/ui/GridSystem'
import PageTitle from '@/app/components/ui/PageTitle'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import PostMarqueeRow from '@/app/components/blog/PostMarqueeRow'

const FEATURED_POSTS = [
  {label: '12 Mar', title: 'Glambot at a Chanel store opening'},
  {label: '4 Feb', title: 'AI portraits for Formula 1 hospitality'},
  {label: '18 Jan', title: 'A permanent booth built for Dior'},
]

const CLIENTS = [
  'Prada',
  'Adidas',
  'Chanel',
  'Formula 1',
  'Dior',
  'Aston Martin',
  'Louis Vuitton',
  'Gucci',
  'Ferrari',
  'Hermès',
  'Cartier',
  'Balenciaga',
]

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
          <HomeHero />
          <div className="px-10">
            <div className="max-w-[1000px] ">
              <TextReveal
                className="body-text font-normal"
                text="Glambot, AI portraits and custom-built booths for store openings, activations and celebrations. Designed around your brand, run by our crew, measured after."
              />
            </div>
            <div className="grid grid-cols-3 gap-10 py-10">
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
          <div className="border-y-site">
            <Marquee
              speed={70}
              runClassName="mx-0"
              className="h-auto py-8"
              accessibleText={CLIENTS.join(', ')}
            >
              <div className="flex items-center text-2xl font-semibold tracking-tight md:text-4xl">
                {CLIENTS.map((name) => (
                  <span key={name} className="px-8">
                    {name}
                  </span>
                ))}
              </div>
            </Marquee>
          </div>
          <GridContainer
            columns={[6, 6]}
            className="grid grid-cols-2 gap-10 border-x-0 mx-0 p-0 lg:p-0 lg:mx-0 border-b-site border-black dark:border-white"
          >
            <div className="p-10">
              <div className="bg-black aspect-square w-full" />
            </div>
            <div className="p-10">
              <div className="space-y-5 flex flex-col">
                <header className="space-y-2">
                  <LocalizedLink
                    href={'/'}
                    className="inline-block text-sm font-semibold uppercase tracking-wide hover:underline"
                  >
                    AI BOOTH
                  </LocalizedLink>
                  <PageTitle as="h2">Saudia x Formula E</PageTitle>
                </header>
                <TextReveal
                  className="body-text font-normal text-black"
                  text={`An experience that blends aviation and motorsport branding with collectible design aesthetics, delivering highly shareable digital outputs and optional prints that feel like personalised retail products.`}
                />
              </div>
            </div>
          </GridContainer>
          <div className="border-b-site border-black dark:border-white">
            <h2 className="flex items-center gap-5 p-5 pb-0 text-lg font-semibold uppercase lg:p-10 lg:pb-0">
              <span className="block h-4 w-4 bg-black dark:bg-white" />
              Journal
            </h2>
            {FEATURED_POSTS.map((post, index) => (
              <PostMarqueeRow
                key={post.title}
                href="/blog"
                label={post.label}
                title={post.title}
                index={index}
              />
            ))}
          </div>
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
