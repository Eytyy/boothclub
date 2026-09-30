import {defineQuery} from 'next-sanity'

// Active language, then English. length() treats "" and [] as missing.
// Parentheses keep `desc` attached to the comparison; the API rejects it on `$lang`.
const localizedValue = /* groq */ `[(language == $lang || language == "en") && length(value) > 0] | order((language == $lang) desc)[0].value`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->{ _type, "slug": slug.current },
    "post": post->slug.current,
    "product": product->{
      _id,
      "title": title${localizedValue},
      "slug": slug.current,
      "categorySlug": category->slug.current
    },
    "productCategory": productCategory->{
      _id,
      "title": title${localizedValue},
      "slug": slug.current
    },
    "project": project->{
      _id,
      "title": title${localizedValue},
      "slug": slug.current
    }
  }
`

const imageProjection = /* groq */ `
  ...,
  "lqip": asset->metadata.lqip,
  "alt": alt${localizedValue},
  "credits": credits${localizedValue}
`

const localizedPortableText = /* groq */ `${localizedValue}[]{
  ...,
  markDefs[]{
    ...,
    ${linkReference}
  }
}`

const localizedPortableTextWithImages = /* groq */ `${localizedValue}[]{
  ...,
  _type == "image" => {
    ${imageProjection}
  },
  markDefs[]{
    ...,
    ${linkReference}
  }
}`

const seoFields = /* groq */ `
  "metaTitle": metaTitle${localizedValue},
  "metaDescription": metaDescription${localizedValue},
  metaImage
`

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": title${localizedValue},
  "slug": slug.current,
  "excerpt": meta.description${localizedValue},
  meta {
    "title": title${localizedValue},
    "description": description${localizedValue},
    image
  },
  "coverImage": coalesce(mainImage, coverImage) { ${imageProjection} },
  "date": coalesce(publishedAt, date, _updatedAt),
`

/** Latest posts for featuredBlog blocks (not stored on the document). */
const featuredBlogPostsProjection = /* groq */ `
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc, _updatedAt desc) [0...4] {
    ${postFields}
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
  }
`

const buttonProjection = /* groq */ `
  ...,
  "buttonText": buttonText${localizedValue},
  ${linkFields}
`

const pageBuilderFields = /* groq */ `
  "pageBuilder": pageBuilder[]{
    _key,
    _type,
    _type == "callToAction" => {
      ...,
      "tagline": tagline${localizedValue},
      "video": video.asset-> {
        playbackId,
        assetId,
        filename,
      },
      images[] {
        ...,
        "url": asset->url,
        "dimensions": asset->metadata.dimensions,
        "lqip": asset->metadata.lqip
      },
      gif {
        ...,
        "url": asset->url
      },
      button {
        ${buttonProjection}
      }
    },
    _type == "block.text" => {
      layout,
      "content": content${localizedPortableTextWithImages}
    },
    _type == "block.image" => {
      ${imageProjection}
    },
    _type == "block.video" => {
      ...,
      "muxVideo": muxVideo.asset-> {
        playbackId,
        assetId,
        filename,
      }
    },
    _type == "featuredClients" => {
      ...,
      "heading": heading${localizedValue},
      rows[]{
        _key,
        "heading": heading${localizedValue},
        clients[]->{
          _id,
          "name": name${localizedValue},
          darkLogo,
          lightLogo,
          shape,
          displaySize,
        }
      },
      testimonials[]->{
        _id,
        "quote": quote${localizedValue},
        "name": name${localizedValue},
        "company": company${localizedValue}
      }
    },
    _type == "featuredProducts" => {
      _key,
      _type,
      "heading": heading${localizedValue},
      "products": product[]->{
        _id,
        "title": title${localizedValue},
        "excerpt": excerpt${localizedValue},
        "slug": slug.current,
        "categorySlug": category->slug.current,
        "description": description${localizedPortableText},
        mainImage { ${imageProjection} },
        "featuredProjects": featuredProjects[]->{
          _id,
          "title": title${localizedValue},
          mainImage { ${imageProjection} }
        }
      }
    },
    _type == "featuredBlog" => {
      ...,
      "heading": heading${localizedValue},
      cta {
        ${buttonProjection}
      },
      ${featuredBlogPostsProjection}
    },
  }
`

/** Nested video fields for `block.video` inside `block.media` (project detail). */
const projectNestedVideoProjection = /* groq */ `
  ...,
  "muxVideo": muxVideo.asset-> {
    playbackId,
    assetId,
    filename,
  }
`

const projectMediaProjection = /* groq */ `
  type,
  image { ${imageProjection} },
  video {
    ${projectNestedVideoProjection}
  }
`

/** Project document `blocks` (copy + media), `gallery`, and `output` images. */
const projectBlocksProjection = /* groq */ `
  blocks[]{
    _key,
    _type,
    _type == "block.copy" => {
      showHeadline,
      showText,
      "headline": headline${localizedValue},
      "text": text${localizedValue}
    },
    _type == "block.media" => {
      ${projectMediaProjection}
    }
  },
  gallery[] {
    _key,
    ${imageProjection},
    "dimensions": asset->metadata.dimensions
  },
  output[] {
    _key,
    ${imageProjection}
  }
`

/** About page `pageBuilder` — text, media, content section, stats, team, minimal CTA. */
const aboutBlocksProjection = /* groq */ `
  "pageBuilder": pageBuilder[]{
    _key,
    _type,
    _type == "block.text" => {
      layout,
      "content": content${localizedPortableTextWithImages}
    },
    _type == "block.media" => {
      ${projectMediaProjection}
    },
    _type == "block.contentSection" => {
      "headline": headline${localizedValue},
      "text": text${localizedValue}
    },
    _type == "stats" => {
      items[]{
        ...,
        "value": value${localizedValue},
        "suffix": suffix${localizedValue},
        "label": label${localizedValue}
      }
    },
    _type == "team" => {
      "heading": heading${localizedValue},
      members[]->{
        _id,
        "firstName": firstName${localizedValue},
        "lastName": lastName${localizedValue},
        "bio": bio${localizedValue},
        "picture": picture { ${imageProjection} }
      }
    },
    _type == "cta" => {
      "headline": headline${localizedValue},
      "tagline": tagline${localizedValue},
      button {
        ${buttonProjection}
      }
    }
  }
`

const muxVideoProjection = /* groq */ `
  ...asset-> {
    playbackId,
    assetId,
    filename,
  }
`

/** Product fields used wherever the frontend builds a nested product href. */
const projectProductFields = /* groq */ `
  _id,
  "title": title${localizedValue},
  "slug": slug.current,
  "category": category->{
    _id,
    "title": title${localizedValue},
    "slug": slug.current
  }
`

const productListItemFields = /* groq */ `
  _id,
  "title": title${localizedValue},
  "excerpt": excerpt${localizedValue},
  "slug": slug.current,
  "categorySlug": category->slug.current,
  mainImage { ${imageProjection} }
`

const projectCardFields = /* groq */ `
  _id,
  "title": title${localizedValue},
  "slug": slug.current,
  mainImage { ${imageProjection} },
  "product": product->{
    ${projectProductFields}
  }
`

export const homePageQuery = defineQuery(`
  *[_type == "home" && _id == "homePage"][0]{
    _id,
    _type,
    hero {
      "headline": headline${localizedValue},
      "subheadline": subheadline${localizedValue},
      "taglineWithVideo": taglineWithVideo${localizedValue},
      video {
        ...asset -> {
          playbackId,
          assetId,
          filename,
        }
      }
    },
    ${pageBuilderFields},
    featuredProjects{
      ...,
      items[]->{
        ${projectCardFields}
      },
      cta {
        ${buttonProjection}
      }
    },
    seo {
      ${seoFields}
    }
  }
`)

export const blogPageQuery = defineQuery(`
  *[_type == "blog" && _id == "blogPage"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "blogPostFooter": blogPostFooter${localizedPortableTextWithImages},
    seo {
      ${seoFields}
    }
  }
`)

export const aboutPageQuery = defineQuery(`
  *[_type == "about" && _id == "aboutPage"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "headline": headline${localizedValue},
    ${aboutBlocksProjection},
    seo {
      ${seoFields}
    }
  }
`)

export const privacyPolicyPageQuery = defineQuery(`
  *[_type == "privacyPolicy" && _id == "privacyPolicyPage"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "body": body${localizedPortableTextWithImages},
    seo {
      ${seoFields}
    }
  }
`)

export const projectsPageQuery = defineQuery(`
  *[_type == "projects" && _id == "projectsPage"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    seo {
      ${seoFields}
    },
    "featuredIds": featuredProjects[]->_id
  }
`)

export const allProjectsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)] | order(_createdAt desc) {
    ${projectCardFields}
  }
`)

export const projectDetailQuery = defineQuery(`
  *[_type == "project" && (slug.current == $slug || $slug in legacySlugs)][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "slug": slug.current,
    legacySlugs,
    mainImage { ${imageProjection} },
    heroVideo {
      ${muxVideoProjection}
    },
    "product": product->{
      ${projectProductFields}
    },
    "description": description${localizedPortableText},
    ${projectBlocksProjection},
    seo {
      ${seoFields}
    }
  }
`)

export const projectSlugs = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  {"slug": slug.current}
`)

export const sitemapData = defineQuery(`
  *[_type in ["post", "project", "product", "productCategory"] && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
    _type == "product" => {
      "categorySlug": category->slug.current
    }
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const relatedPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && references($documentId)]
    | order(coalesce(publishedAt, date, _updatedAt) desc) {
    ${postFields}
  }
`)

/** Previous (nearest older) and next (nearest newer) posts relative to `$date` / `$id`. */
export const adjacentPostsQuery = defineQuery(`{
  "previous": *[_type == "post" && _id != $id && defined(slug.current) && (
    coalesce(publishedAt, date, _updatedAt) < $date ||
    (coalesce(publishedAt, date, _updatedAt) == $date && _id < $id)
  )] | order(coalesce(publishedAt, date, _updatedAt) desc, _id desc) [0] {
    ${postFields}
  },
  "next": *[_type == "post" && _id != $id && defined(slug.current) && (
    coalesce(publishedAt, date, _updatedAt) > $date ||
    (coalesce(publishedAt, date, _updatedAt) == $date && _id > $id)
  )] | order(coalesce(publishedAt, date, _updatedAt) asc, _id asc) [0] {
    ${postFields}
  }
}`)

const postSectionsProjection = /* groq */ `
  "sections": body[]{
    _key,
    _type,
    columns,
    blocks[]{
      _key,
      _type,
      span,
      _type == "post.content" => {
        "content": content${localizedPortableTextWithImages}
      },
      _type == "post.media" => {
        media {
          ${projectMediaProjection}
        }
      }
    }
  }
`

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    ${postSectionsProjection},
    "blogPostFooter": *[_type == "blog" && _id == "blogPage"][0].blogPostFooter${localizedPortableTextWithImages},
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const productSlugs = defineQuery(`
  *[_type == "product" && defined(slug.current) && defined(category._ref)]
  {"slug": slug.current, "categorySlug": category->slug.current}
`)

export const productCategorySlugs = defineQuery(`
  *[_type == "productCategory" && defined(slug.current)]
  {"slug": slug.current}
`)

const menuItemFields = /* groq */ `
  _key,
  _type,
  "title": title${localizedValue},
  link {
    ...,
    ${linkReference}
  }
`

const formConfigProjection = /* groq */ `
  _id,
  key,
  recipients,
  "description": description${localizedValue},
  "successMessage": successMessage${localizedValue},
  "errorText": errorText${localizedValue},
  "consentText": consentText${localizedValue},
  "notificationsLabel": notificationsLabel${localizedValue},
  "personalDataNote": personalDataNote${localizedValue},
  "privacyPageSlug": privacyPage->slug.current
`

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    "title": title${localizedValue},
    "description": description${localizedValue},
    ogImage {
      ...,
      "alt": alt${localizedValue},
      "metadataBase": metadataBase
    },
    getInTouchCTA {
      "heading": heading${localizedValue},
      "buttonLabel": buttonLabel${localizedValue},
      link {
        ...,
        ${linkReference}
      }
    },
    locations[] {
      "name": name${localizedValue},
      "content": content${localizedPortableText}
    },
    socialLinks[] {
      platform,
      "label": label${localizedValue},
      link
    },
    "siteMenu": siteMenu->{
      _id,
      "ctaLabel": ctaLabel${localizedValue},
      items[] {
        _key,
        _type,
        _type == "menuItemGroup" => {
          "title": title${localizedValue},
          "items": items[] {
            ${menuItemFields}
          }
        },
        _type == "menuItem" => {
          ${menuItemFields}
        }
      }
    },
    footerMenu[] {
      ${menuItemFields}
    }
  }
`)

export const contactPageQuery = defineQuery(`
  *[_type == "contact"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "headline": headline${localizedValue},
    "form": form->{
      ${formConfigProjection}
    },
    "addressTitle": addressTitle${localizedValue},
    googleMapsUrl,
    mapImage { ${imageProjection} },
    seo {
      ${seoFields}
    }
  }
`)

export const careersPageQuery = defineQuery(`
  *[_type == "careers"][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "intro": intro${localizedValue},
    applyEmail,
    mainImage { ${imageProjection} },
    benefits[]{
      "headline": headline${localizedValue},
      "description": description${localizedValue}
    },
    "jobOpenings": jobOpenings[]->{
      _id,
      "title": title${localizedValue},
      "location": location${localizedValue},
      employmentType,
      "description": description${localizedPortableText}
    },
    seo {
      ${seoFields}
    }
  }
`)

export const getProductCategoryQuery = defineQuery(`
  *[_type == "productCategory" && slug.current == $slug][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "tagline": tagline${localizedValue},
    "description": description${localizedPortableText},
    "slug": slug.current,
    mainImage { ${imageProjection} },
    heroVideo {
      ${muxVideoProjection}
    },
    seo {
      ${seoFields}
    },
    "featuredProjects": featuredProjects[]->{
      ${projectCardFields}
    },
    "products": *[_type == "product" && category._ref == ^._id && defined(slug.current)] | order(title${localizedValue} asc) {
      ${productListItemFields}
    }
  }
`)

export const getProductQuery = defineQuery(`
  *[_type == "product" && slug.current == $product && category._ref in *[_type == "productCategory" && slug.current == $slug]._id][0]{
    _id,
    _type,
    "title": title${localizedValue},
    "excerpt": excerpt${localizedValue},
    "slug": slug.current,
    "category": category->{
      _id,
      "slug": slug.current,
      "title": title${localizedValue}
    },
    "description": description${localizedPortableText},
    mainImage { ${imageProjection} },
    heroVideo {
      ${muxVideoProjection}
    },
    specs {
      items[]{
        _key,
        "text": text${localizedValue}
      }
    },
    copy {
      showHeadline,
      showText,
      "headline": headline${localizedValue},
      "text": text${localizedValue}
    },
    seo {
      ${seoFields}
    },
    "featuredProjects": featuredProjects[]->{
      ${projectCardFields},
      gallery[] {
        _key,
        ${imageProjection}
      }
    }
  }
`)

export const otherProductsQuery = defineQuery(`
  *[_type == "product" && _id != $currentId && category._ref == $categoryId && defined(slug.current)] | order(title${localizedValue} asc) {
    ${productListItemFields}
  }
`)

export const otherProductsCategoryQuery = defineQuery(`
  *[_type == "productCategory" && _id != $currentId && defined(slug.current)] | order(title${localizedValue} asc) {
    _id,
    "title": title${localizedValue},
    "tagline": tagline${localizedValue},
    "slug": slug.current,
    mainImage { ${imageProjection} },
  }
`)

export const otherProjectsQuery = defineQuery(`
  *[_type == "project" && _id != $currentId && defined(slug.current) && product._ref == $productId] | order(_createdAt desc) [0...5] {
    ${projectCardFields},
    gallery[] {
      _key,
      ${imageProjection}
    }
  }
`)

export const projectFiltersQuery = defineQuery(`
  *[_type == "productCategory" && defined(slug.current)] | order(title${localizedValue} asc) {
    _id,
    "title": title${localizedValue},
    "slug": slug.current,
    "products": *[_type == "product" && category._ref == ^._id && defined(slug.current)] | order(title${localizedValue} asc) {
      _id,
      "title": title${localizedValue},
      "slug": slug.current
    }
  }
`)

export const formConfigByKeyQuery = defineQuery(`
  *[_type == "formConfig" && key == $key][0]{
    ${formConfigProjection}
  }
`)
