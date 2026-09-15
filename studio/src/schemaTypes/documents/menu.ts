import {MenuIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  description:
    'Add top-level menu links directly, or organize them inside groups (each group expands to reveal its links). Optional "CTA button label" (header menu only) renders a Get in touch button after the last entry, linking to /contact.',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({type: 'menuItemGroup'}),
        defineArrayMember({type: 'menuItem'}),
      ],
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA button label',
      type: 'internationalizedArrayString',
      description:
        'Optional. Rendered as a primary button at the end of the last group (links to /contact).',
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
