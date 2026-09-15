import {localizedPath, type Locale} from '@/app/lib/i18n/config'
import {productCategoryPath, productPath} from '@/app/lib/product/paths'
import {Link} from '@/sanity.types'
import {dataset, projectId, studioUrl} from '@/sanity/lib/api'
import {createDataAttribute, CreateDataAttributeProps, type PortableTextBlock} from 'next-sanity'
import {stegaClean} from '@sanity/client/stega'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {DereferencedLink, DereferencedProduct} from '@/sanity/lib/types'

const builder = imageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// Create an image URL builder using the client
// Export a function that can be used to get image URLs
function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

export function resolveOpenGraphImage(
  image?: SanityImageSource | null,
  width = 1200,
  height = 627,
) {
  if (!image) return
  // An image field can exist as an object with only `alt` set and no asset
  // uploaded, which makes the URL builder throw instead of returning nothing.
  if (typeof image !== 'string') {
    const source = image as {asset?: unknown; _ref?: unknown; _id?: unknown}
    if (!source.asset && !source._ref && !source._id) return
  }
  const url = urlForImage(image)?.width(1200).height(627).fit('crop').url()
  if (!url) return
  return {url, alt: (image as {alt?: string})?.alt || '', width, height}
}

// Resolve a Next.js Metadata `title` value from a CMS-authored meta title and a
// fallback. When an explicit `metaTitle` is set, it is treated as the complete,
// final title via `{absolute}` so the root layout's `%s | {brand}` template does
// NOT append the site brand (avoids double-branding). When omitted, the plain
// fallback string is returned so the template applies and the brand is appended.
export function resolveMetaTitle(
  metaTitle?: string | null,
  fallback?: string | null,
): {absolute: string} | string | undefined {
  const trimmed = metaTitle?.trim()
  if (trimmed) return {absolute: trimmed}
  return fallback?.trim() || undefined
}

// Maps singleton schema types to their frontend routes.
const singletonRoutes: Record<string, string> = {
  home: '/',
  blog: '/blog',
  projects: '/projects',
  about: '/about',
  contact: '/contact',
  careers: '/careers',
  privacyPolicy: '/privacy-policy',
}

// Maps singleton document IDs (from desk structure) to routes.
// Needed when GROQ dereference fails and we get a raw { _ref, _type: "reference" }.
const singletonIdRoutes: Record<string, string> = {
  homePage: '/',
  blogPage: '/blog',
  projectsPage: '/projects',
  aboutPage: '/about',
  careersPage: '/careers',
  contactPage: '/contact',
  privacyPolicyPage: '/privacy-policy',
}

function isProtocolOrAbsoluteHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:|\/\/)/i.test(href)
}

function isDereferencedProduct(product: unknown): product is DereferencedProduct {
  return typeof product === 'object' && product !== null && 'slug' in product
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | DereferencedLink | undefined, lang: Locale) {
  if (!link) return null

  // Stega can taint string compares / href attributes during visual editing.
  const linkType = stegaClean(link.linkType)
  const href = stegaClean(link.href)?.trim()
  const email = stegaClean(link.email)?.trim()
  const phone = stegaClean(link.phone)?.trim()

  // If linkType is not set but href is, treat as URL. Comes into play when pasting
  // links into the portable text editor because a link type is not assumed.
  const resolvedType = linkType || (href ? 'href' : undefined)

  switch (resolvedType) {
    case 'href': {
      if (!href) return null
      // Normalize tel: URIs that may include spaces from the Studio URL field
      if (/^tel:/i.test(href)) {
        const rest = href.slice(4).trim()
        const hasPlus = rest.startsWith('+')
        const digits = rest.replace(/\D/g, '')
        return digits ? `tel:${hasPlus ? '+' : ''}${digits}` : null
      }
      if (isProtocolOrAbsoluteHref(href)) return href
      return localizedPath(lang, href)
    }
    case 'page': {
      const page = link.page as
        | {_type: string; _ref?: string; slug?: string | null}
        | undefined
        | null
      if (!page) return null

      // Dereferenced singleton (e.g. { _type: "projects" })
      if (singletonRoutes[page._type]) return localizedPath(lang, singletonRoutes[page._type])

      // Raw reference fallback (e.g. { _ref: "projectsPage", _type: "reference" })
      if (page._ref && singletonIdRoutes[page._ref]) {
        return localizedPath(lang, singletonIdRoutes[page._ref])
      }

      // Regular page with slug
      return page.slug ? localizedPath(lang, `/${page.slug}`) : null
    }
    case 'post':
      if (link?.post && typeof link.post === 'string') {
        return localizedPath(lang, `/blog/${stegaClean(link.post)}`)
      }
      return null
    case 'product': {
      if (!isDereferencedProduct(link.product)) return null
      const slug = stegaClean(link.product.slug)
      const categorySlug = stegaClean(link.product.categorySlug)
      if (!slug || !categorySlug) return null
      return localizedPath(lang, productPath(categorySlug, slug))
    }
    case 'productCategory': {
      if (link.productCategory && typeof link.productCategory === 'string') {
        const slug = stegaClean(link.productCategory)
        return slug ? localizedPath(lang, productCategoryPath(slug)) : null
      }
      return null
    }
    case 'email':
      return email ? `mailto:${email}` : null
    case 'phone': {
      if (!phone) return null
      // Keep a leading + for international dialing (e.g. +971 …)
      const hasPlus = phone.startsWith('+')
      const digits = phone.replace(/\D/g, '')
      return digits ? `tel:${hasPlus ? '+' : ''}${digits}` : null
    }
    default:
      return null
  }
}

// Normalize Sanity-generated block content (where `children` is optional and
// query-result shapes are anonymous inline types) to `PortableTextBlock[]`
// (where `children` is required) for the shared `CustomPortableText`
// component. Returns an empty array for null/undefined input so call sites
// can render conditionally on `length`.
export function toPortableTextBlocks(
  body: readonly unknown[] | null | undefined,
): PortableTextBlock[] {
  return (body ?? []) as unknown as PortableTextBlock[]
}

// Flatten Portable Text block content to a plain-text string suitable for
// meta descriptions (Open Graph, Twitter, search snippets). Joins spans
// across blocks with a single space, collapses whitespace, and truncates
// on a word boundary with an ellipsis when over `maxLength`.
export function toMetaDescription(
  body: readonly unknown[] | null | undefined,
  maxLength = 160,
): string | undefined {
  if (!Array.isArray(body) || body.length === 0) return undefined

  type Span = {_type?: string; text?: string}
  type Block = {_type?: string; children?: Span[]}

  const text = (body as Block[])
    .filter((block) => block?._type === 'block')
    .map((block) =>
      (block.children ?? [])
        .filter((child) => child?._type === 'span' && typeof child.text === 'string')
        .map((child) => child.text)
        .join(''),
    )
    .filter((line) => line.length > 0)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return undefined
  if (text.length <= maxLength) return text

  const truncated = text.slice(0, maxLength).replace(/\s+\S*$/, '').trimEnd()
  return `${truncated}…`
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, 'id' | 'type' | 'path'>>

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config)
}
