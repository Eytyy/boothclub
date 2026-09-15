import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const featuredBlog = defineType({
  name: 'featuredBlog',
  title: 'Featured Blog',
  type: 'object',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'cta', title: 'CTA', default: false},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'content',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'button',
      group: 'cta',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: localizedString(title) || 'Featured Blog',
        subtitle: 'Latest 3 posts',
      }
    },
  },
})
