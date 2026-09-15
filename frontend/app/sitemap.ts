import {MetadataRoute} from 'next'
import {headers} from 'next/headers'

import {locales, localizedPath} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {sitemapLanguageAlternates} from '@/app/lib/seo/alternates'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

type ChangeFrequency =
  | 'monthly'
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'yearly'
  | 'never'

const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFrequency
}> = [
  {path: '/', priority: 1, changeFrequency: 'monthly'},
  {path: '/about', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/contact', priority: 0.7, changeFrequency: 'monthly'},
  {path: '/careers', priority: 0.6, changeFrequency: 'weekly'},
  {path: '/blog', priority: 0.8, changeFrequency: 'weekly'},
  {path: '/projects', priority: 0.8, changeFrequency: 'weekly'},
  {path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly'},
]

function sitemapEntries(
  baseUrl: string,
  path: string,
  priority: number,
  changeFrequency: ChangeFrequency,
  lastModified: Date | string = new Date(),
): MetadataRoute.Sitemap {
  const languages = sitemapLanguageAlternates(baseUrl, path)
  return locales.map((lang) => ({
    url: `${baseUrl}${localizedPath(lang, path)}`,
    lastModified,
    priority,
    changeFrequency,
    alternates: {languages},
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allContent = await sanityFetch({
    query: sitemapData,
  })
  const headersList = await headers()
  const host = headersList.get('host') as string
  const baseUrl = `https://${host}`

  const sitemap: MetadataRoute.Sitemap = []

  for (const route of staticRoutes) {
    sitemap.push(
      ...sitemapEntries(baseUrl, route.path, route.priority, route.changeFrequency),
    )
  }

  if (allContent?.data?.length) {
    for (const item of allContent.data) {
      if (!item.slug) continue

      let priority: number
      let changeFrequency: ChangeFrequency
      let path: string

      switch (item._type) {
        case 'post':
          priority = 0.5
          changeFrequency = 'never'
          path = `/blog/${item.slug}`
          break
        case 'project':
          priority = 0.6
          changeFrequency = 'monthly'
          path = `/projects/${item.slug}`
          break
        case 'productCategory':
          priority = 0.7
          changeFrequency = 'monthly'
          path = productCategoryPath(item.slug)
          break
        case 'product':
          if (!item.categorySlug) continue
          priority = 0.7
          changeFrequency = 'monthly'
          path = productPath(item.categorySlug, item.slug)
          break
        default:
          continue
      }

      sitemap.push(
        ...sitemapEntries(baseUrl, path, priority, changeFrequency, item._updatedAt || new Date()),
      )
    }
  }

  return sitemap
}
