import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const menuItemGroup = defineType({
  name: 'menuItemGroup',
  title: 'Menu item group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'menuItem'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {title: localizedString(title) || 'Untitled group'}
    },
  },
})
