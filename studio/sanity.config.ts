/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {muxInput} from 'sanity-plugin-mux-input'
import {languageFilter} from '@sanity/language-filter'
import {
  internationalizedArray,
  internationalizedArrayLanguageFilter,
} from 'sanity-plugin-internationalized-array'
import {DEFAULT_LANGUAGE, languages} from './src/lib/i18n'

import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {media} from 'sanity-plugin-media'
// import {assist} from '@sanity/assist'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 or localhost:3001 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(
  documentType?: string,
  slug?: string,
  categorySlug?: string,
): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'blog':
      return '/blog'
    case 'post':
      return slug ? `/blog/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'projects':
      return '/projects'
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    case 'productCategory':
      return slug ? `/products/${slug}` : undefined
    case 'product':
      return slug && categorySlug ? `/products/${categorySlug}/${slug}` : undefined
    case 'about':
      return '/projects'
    case 'contact':
      return '/projects'
    case 'careers':
      return '/projects'
    case 'privacyPolicy':
      return '/projects'
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Boothclub',

  projectId,
  dataset,

  plugins: [
    media(),
    internationalizedArray({
      languages,
      defaultLanguages: [DEFAULT_LANGUAGE],
      fieldTypes: ['string', 'text', 'blockContent', 'blockContentTextOnly'],
    }),
    languageFilter({
      supportedLanguages: languages,
      defaultLanguages: [DEFAULT_LANGUAGE],
      filterField: (enclosingType, field, selectedLanguageIds, parentValue) =>
        internationalizedArrayLanguageFilter(
          enclosingType,
          field,
          selectedLanguageIds,
          parentValue,
          languages,
        ),
    }),
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "home" && _id == "homePage"`,
          },
          {
            route: '/blog',
            filter: `_type == "blog" && _id == "blogPage"`,
          },
          {
            route: '/projects',
            filter: `_type == "projects" && _id == "projectsPage"`,
          },
          {
            route: '/projects/:slug',
            filter: `_type == "project" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/products/:slug/:product',
            filter: `_type == "product" && slug.current == $product && category->slug.current == $slug`,
          },
          {
            route: '/products/:slug',
            filter: `_type == "productCategory" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/about',
            filter: `_type == "about" && _id == "aboutPage"`,
          },
          {
            route: '/contact',
            filter: `_type == "contact" && _id == "contactPage"`,
          },
          {
            route: '/careers',
            filter: `_type == "careers" && _id == "careersPage"`,
          },
          {
            route: '/privacy-policy',
            filter: `_type == "privacyPolicy" && _id == "privacyPolicyPage"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/blog/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          home: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on the home page',
            tone: 'positive',
          }),
          blog: defineLocations({
            locations: [
              {
                title: 'Blog',
                href: '/blog',
              },
            ],
            message: 'This document is used on the blog page',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          post: defineLocations({
            select: {
              title: 'title.0.value',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href: '/',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
          projects: defineLocations({
            locations: [
              {
                title: 'Projects',
                href: '/projects',
              },
            ],
            message: 'This document is used on the projects page',
            tone: 'positive',
          }),
          project: defineLocations({
            select: {
              title: 'title.0.value',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('project', doc?.slug)!,
                },
                {
                  title: 'Projects',
                  href: '/projects',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
          product: defineLocations({
            select: {
              title: 'title.0.value',
              slug: 'slug.current',
              categorySlug: 'category.slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('product', doc?.slug, doc?.categorySlug)!,
                },
              ],
            }),
          }),
          productCategory: defineLocations({
            select: {
              title: 'title.0.value',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('productCategory', doc?.slug)!,
                },
              ],
            }),
          }),
          about: defineLocations({
            locations: [
              {
                title: 'About',
                href: '/about',
              },
            ],
            message: 'This document is used on the about page',
            tone: 'positive',
          }),
          contact: defineLocations({
            locations: [
              {
                title: 'Contact',
                href: '/contact',
              },
            ],
            message: 'This document is used on the contact page',
            tone: 'positive',
          }),
          careers: defineLocations({
            locations: [
              {
                title: 'Careers',
                href: '/careers',
              },
            ],
            message: 'This document is used on the careers page',
            tone: 'positive',
          }),
          privacyPolicy: defineLocations({
            locations: [
              {
                title: 'Privacy Policy',
                href: '/privacy-policy',
              },
            ],
            message: 'This document is used on the privacy policy page',
            tone: 'positive',
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    muxInput(),
    // assist(),
    visionTool(),
  ],
  form: {
    image: {
      assetSources: (previousAssetSources) =>
        previousAssetSources.filter((source) => source.name !== 'sanity-default'),
    },
    file: {
      assetSources: (previousAssetSources) =>
        previousAssetSources.filter((source) => source.name !== 'sanity-default'),
    },
  },

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
