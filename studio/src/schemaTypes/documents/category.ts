import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

export const category = defineType({
  name: 'category',
  title: 'Category',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => slugFromLocalized(doc),
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
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
      title: 'title',
    },
    prepare({title}) {
      return {title: localizedString(title) || 'Untitled'}
    },
  },
})
