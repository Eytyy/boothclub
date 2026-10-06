import {CaseIcon, SearchIcon, ComposeSparklesIcon, TagIcon, ImageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'internationalizedArrayText',
      description: 'Short summary used where the project is featured, such as the home page.',
      group: 'contents',
    }),
    defineField({
      name: 'blocks',
      title: 'Project blocks',
      type: 'array',
      of: [defineArrayMember({type: 'block.copy'}), defineArrayMember({type: 'block.media'})],
      group: 'contents',
    }),
    defineField({
      name: 'output',
      title: 'Output',
      type: 'array',
      of: [defineArrayMember({type: 'block.image'})],
      description: 'Optional row of images below the project blocks. Leave empty or add exactly 3.',
      options: {layout: 'grid'},
      validation: (rule) =>
        rule.max(3).custom((images) => {
          const count = images?.length ?? 0
          if (count === 0 || count === 3) {
            return true
          }
          return 'Add exactly 3 images, or leave empty'
        }),
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
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [defineArrayMember({type: 'block.image'})],
      group: 'media',
    }),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
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
      productTitle: 'product.title',
    },
    prepare({title, media, productTitle}) {
      return {
        title: localizedString(title) || 'Untitled',
        media,
        subtitle: localizedString(productTitle) || 'No product',
      }
    },
  },
})
