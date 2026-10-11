import type {Metadata} from 'next'
import {stegaClean} from '@sanity/client/stega'

import PageBuilder from '@/app/components/page-builder/PageBuilder.client'
import {PageMainMedia} from '@/app/components/page/PageMainMedia'
import {GridBlock, GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import {Marquee} from '@/app/components/ui/Marquee.client'
import PageTitle from '@/app/components/ui/PageTitle'
import PortableText from '@/app/components/ui/PortableText'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {aboutPageQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle, toMetaDescription, toPortableTextBlocks} from '@/sanity/lib/utils'
import TeamMembers from './TeamMembers.client'

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
    description: page?.seo?.metaDescription ?? toMetaDescription(page?.body),
    alternates: localeAlternates(lang, '/about'),
  } satisfies Metadata
}

export default async function AboutPage({params}: Props) {
  const {lang} = await params
  const {data: page} = await sanityFetch({query: aboutPageQuery, params: {lang}})

  const body = toPortableTextBlocks(page?.body)
  const media = page?.mainMedia
  const heroPlaybackId =
    stegaClean(media?.type) === 'video' ? (media?.video?.muxVideo?.playbackId ?? null) : null
  const team = page?.teamSection
  const members = team?.members ?? []

  return (
    <>
      <div className="container">
        {/* Media on one side, title and story on the other. */}
        <GridContainer>
          <GridColumn span={6}>
            <GridBlock className="border-b-site border-black lg:border-b-0 dark:border-white">
              <PageMainMedia
                className="aspect-4/5"
                title={page?.title ?? ''}
                mainImage={media?.image}
                heroPlaybackId={heroPlaybackId}
              />
            </GridBlock>
          </GridColumn>
          <GridColumn span={6}>
            <GridBlock className="space-y-5 lg:space-y-8">
              <PageTitle as="h1">{page?.title}</PageTitle>
              {body.length > 0 ? <PortableText className="body-text" value={body} /> : null}
            </GridBlock>
          </GridColumn>
        </GridContainer>

        {members.length > 0 ? (
          <GridContainer columns="none" className="border-t-site border-black dark:border-white">
            <section className="col-span-full">
              {team?.headline ? (
                <Marquee
                  as="h2"
                  accessibleText={team.headline}
                  speed={80}
                  className="h-auto border-b-site border-black py-4 lg:py-6 dark:border-white"
                >
                  <span className="text-3xl font-bold tracking-tight normal-case md:text-5xl">
                    {team.headline}
                  </span>
                </Marquee>
              ) : null}
              <TeamMembers members={members} />
            </section>
          </GridContainer>
        ) : null}
      </div>
      {/* Its empty state would read as a broken page under the sections above. */}
      {page?.pageBuilder?.length ? <PageBuilder page={page} /> : null}
    </>
  )
}
