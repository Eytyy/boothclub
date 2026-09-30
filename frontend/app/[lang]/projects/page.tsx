import type {Metadata} from 'next'
import {Suspense} from 'react'

import type {ProjectFilterOption} from '@/app/components/project/types'
import type {Locale} from '@/app/lib/i18n/config'
import {localeAlternates} from '@/app/lib/seo/alternates'
import {mapAllProjectItemToProjectCardData} from '@/app/lib/project/mappers'
import ProjectPageContent from './ProjectPageContent.client'
import {sanityFetch} from '@/sanity/lib/live'
import {projectsPageQuery, allProjectsQuery, projectFiltersQuery} from '@/sanity/lib/queries'
import {resolveMetaTitle} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const {data: page} = await sanityFetch({
    query: projectsPageQuery,
    params: {lang},
    stega: false,
  })

  return {
    title: resolveMetaTitle(page?.seo?.metaTitle, page?.title),
    description: page?.seo?.metaDescription ?? undefined,
    alternates: localeAlternates(lang, '/projects'),
  } satisfies Metadata
}

export default async function ProjectsPage({params}: Props) {
  const {lang} = await params
  const [{data: projects}, {data: filters}] = await Promise.all([
    sanityFetch({query: allProjectsQuery, params: {lang}}),
    sanityFetch({query: projectFiltersQuery, params: {lang}}),
  ])

  const projectItems =
    projects
      ?.filter((project): project is typeof project & {title: string} => Boolean(project.title))
      .map((project) => mapAllProjectItemToProjectCardData(project)) ?? []

  const filterOptions: ProjectFilterOption[] =
    filters
      ?.filter((category): category is typeof category & {title: string} => Boolean(category.title))
      .map((category) => ({
        _id: category._id,
        title: category.title,
        slug: category.slug,
        products: category.products
          .filter((product): product is typeof product & {title: string} => Boolean(product.title))
          .map((product) => ({
            _id: product._id,
            title: product.title,
            slug: product.slug,
          })),
      })) ?? []

  return (
    <div className="container">
      <Suspense>
        <ProjectPageContent items={projectItems} filters={filterOptions} />
      </Suspense>
    </div>
  )
}
