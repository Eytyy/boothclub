import {ListIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const productSpecs = defineType({
  name: 'product.specs',
  title: 'Specs',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spec',
          title: 'Spec',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}) {
              return {title: localizedString(text) || 'Untitled spec'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      firstText: 'items.0.text',
    },
    prepare({firstText}) {
      return {
        title: 'Specs',
        subtitle: localizedString(firstText) || 'Empty',
      }
    },
  },
})
