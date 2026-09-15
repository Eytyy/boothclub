import {CogIcon, DocumentIcon, DocumentsIcon, EnvelopeIcon, TagIcon, StarIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

/**
 * Structure builder is useful whenever you want to control how documents are grouped and
 * listed in the studio or for adding additional in-studio previews or content to documents.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('home').documentId('homePage'))
        .icon(StarIcon),
      S.documentTypeListItem('client').icon(DocumentsIcon).title('Clients'),
      S.divider(),
      S.documentTypeListItem('productCategory').icon(TagIcon).title('Product Categories'),
      S.documentTypeListItem('product').icon(DocumentsIcon).title('Products'),
      S.divider(),
      S.listItem()
        .title('Projects')
        .child(S.document().schemaType('projects').documentId('projectsPage'))
        .icon(StarIcon),
      S.documentTypeListItem('project').icon(DocumentsIcon).title('Projects'),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(S.document().schemaType('blog').documentId('blogPage'))
        .icon(StarIcon),
      S.documentTypeListItem('post').icon(DocumentsIcon).title('Blog Posts'),
      S.documentTypeListItem('category').icon(TagIcon).title('Blog Posts Categories'),
      S.divider(),
      S.listItem()
        .title('Careers')
        .child(S.document().schemaType('careers').documentId('careersPage'))
        .icon(StarIcon),
      S.documentTypeListItem('jobOpening').icon(DocumentsIcon).title('Job openings'),
      S.divider(),
      S.listItem()
        .title('About')
        .child(S.document().schemaType('about').documentId('aboutPage'))
        .icon(StarIcon),
      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contact').documentId('contactPage'))
        .icon(StarIcon),
      S.listItem()
        .title('Privacy Policy')
        .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicyPage'))
        .icon(DocumentIcon),
      S.divider(),
      S.listItem()
        .title('Forms')
        .icon(EnvelopeIcon)
        .child(S.documentTypeList('formConfig').title('Forms')),
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
