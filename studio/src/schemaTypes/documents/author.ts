import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

export const author = defineType({
  name: 'author',
  title: 'Author',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => slugFromLocalized(doc, 'name'),
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'sourceKey',
      title: 'Contentful Source Key',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: 'name',
      media: 'image',
    },
    prepare({name, media}) {
      return {
        title: localizedString(name) || 'Untitled',
        media,
      }
    },
  },
})
