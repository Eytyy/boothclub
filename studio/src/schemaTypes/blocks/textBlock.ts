import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

import {localizedBlockText} from '../../lib/i18n'

export const textBlock = defineType({
  name: 'block.text',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Single column', value: 'single'},
          {title: 'Two columns (2xl+)', value: 'twoColumn'},
        ],
        layout: 'radio',
      },
      initialValue: 'single',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
    }),
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare({content}) {
      return {
        title: 'Text Block',
        subtitle: localizedBlockText(content) || 'Untitled text block',
      }
    },
  },
})
