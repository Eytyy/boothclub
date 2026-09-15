import {CaseIcon, SearchIcon, ComposeSparklesIcon, TagIcon, ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

export const project = defineType({
  name: 'project',
  title: 'Project',
  icon: CaseIcon,
  type: 'document',
  groups: [
    {name: 'contents', title: 'Contents', icon: ComposeSparklesIcon, default: true},
    {name: 'media', title: 'Media', icon: ImageIcon},
    {name: 'meta', title: 'Meta', icon: TagIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContentTextOnly',
      description: 'Project description shown on the detail page.',
      validation: (rule) => rule.required(),
      group: 'contents',
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'block.image',
      group: 'media',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'mux.video',
      description:
        'Optional Mux video shown at the top of the project page in place of the main image. Falls back to the main image if not set.',
      group: 'media',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page sections',
      description: 'Taglines, full-width media, and two-column media.',
      type: 'array',
      of: [{type: 'block.contentSection'}, {type: 'block.media'}, {type: 'block.splitMedia'}],
      group: 'contents',
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      group: 'meta',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => slugFromLocalized(doc),
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      description:
        "Preserve source slug values to keep URL parity. Click generate to automatically populate the slug from the title, and don't enter it manually.",
      group: 'meta',
    }),
    defineField({
      name: 'legacySlugs',
      title: 'Legacy slugs',
      description:
        'Previous slugs this project was published under. Visitors hitting these will be 301-redirected to the current slug.',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      product1: 'product.0.title',
      product2: 'product.1.title',
      product3: 'product.2.title',
      product4: 'product.3.title',
    },
    prepare({title, media, product1, product2, product3, product4}) {
      const products = [product1, product2, product3, product4]
        .map(localizedString)
        .filter(Boolean)
      return {
        title: localizedString(title) || 'Untitled',
        media,
        subtitle: products.join(', ') || 'No products',
      }
    },
  },
})
