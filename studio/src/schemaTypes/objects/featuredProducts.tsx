import {defineField, defineType} from 'sanity'
import {TagsIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const featuredProducts = defineType({
  name: 'featuredProducts',
  title: 'Featured Products',
  type: 'object',
  icon: TagsIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'product',
      title: 'Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      products: 'product',
    },
    prepare({title, products}) {
      const count = products?.length ?? 0
      return {
        title: localizedString(title) || 'Featured Products',
        subtitle: `${count} product${count === 1 ? '' : 's'}`,
      }
    },
  },
})
