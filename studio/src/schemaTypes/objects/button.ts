import {defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export default defineType({
  name: 'button',
  type: 'object',
  description: 'The button of the call to action',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'link',
      title: 'Button Link',
      type: 'link',
      options: {collapsible: true, collapsed: false},
    }),
  ],
  options: {collapsible: true},
  preview: {
    select: {buttonText: 'buttonText'},
    prepare({buttonText}) {
      return {title: localizedString(buttonText) || 'Button'}
    },
  },
})
