import {AboutPageQueryResult, HomePageQueryResult, SettingsQueryResult} from '@/sanity.types'

type HomeBlocks = NonNullable<HomePageQueryResult> extends {pageBuilder: Array<infer T> | null}
  ? T
  : never

type AboutBlocks = NonNullable<NonNullable<AboutPageQueryResult>['pageBuilder']>[number]

type AboutMediaBlock = Extract<AboutBlocks, {_type: 'block.media'}>

/**
 * No page allows `block.image` / `block.video` at the top level of a `pageBuilder`
 * array, so typegen never emits them as members of the union. Reuse the projected
 * shapes from inside `block.media` rather than the raw `@/sanity.types` documents,
 * whose localized fields are still `InternationalizedArray*`.
 */
type PageBuilderBlockImage = NonNullable<AboutMediaBlock['image']> & {_key: string}

type PageBuilderBlockVideo = NonNullable<AboutMediaBlock['video']> & {_key: string}

export type PageBuilderSection =
  | HomeBlocks
  | AboutBlocks
  | PageBuilderBlockImage
  | PageBuilderBlockVideo
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  {_type: T}
>

/** Product reference after GROQ dereference (`slug` + parent `categorySlug`). */
export type DereferencedProduct = {
  _id?: string | null
  title?: string | null
  slug?: string | null
  categorySlug?: string | null
}

/** Product category after GROQ dereference. Slug-only strings remain valid until typegen catches up. */
export type DereferencedProductCategory = {
  _id?: string | null
  title?: string | null
  slug?: string | null
}

/** Project reference after GROQ dereference. */
export type DereferencedProject = {
  _id?: string | null
  title?: string | null
  slug?: string | null
}

// Represents a Link after GROQ dereferencing (page becomes an object with _type and slug, post becomes a slug string)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page' | 'post' | 'product' | 'productCategory' | 'project' | 'email' | 'phone'
  href?: string
  page?: {_type: string; _ref?: string; slug?: string | null} | null
  post?: string | null
  product?: DereferencedProduct | null
  productCategory?: string | DereferencedProductCategory | null
  project?: DereferencedProject | null
  email?: string
  phone?: string
}

type SiteMenu = NonNullable<NonNullable<SettingsQueryResult>['siteMenu']>
export type SiteMenuItem = NonNullable<SiteMenu['items']>[number]
export type SiteMenuGroup = Extract<SiteMenuItem, {_type: 'menuItemGroup'}>
export type SiteMenuLeaf = Extract<SiteMenuItem, {_type: 'menuItem'}>
export type SiteMenuGroupChild = NonNullable<SiteMenuGroup['items']>[number]
