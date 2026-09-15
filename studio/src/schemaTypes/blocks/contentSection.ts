import {TextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const blockContentSection = defineType({
  name: 'block.contentSection',
  title: 'Content',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayText',
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      text: 'text',
    },
    prepare({headline, text}) {
      const resolved = localizedString(headline) || localizedString(text)
      if (!resolved.length) {
        return {title: 'Content', subtitle: 'Empty'}
      }
      const truncated = resolved.length > 60 ? `${resolved.slice(0, 60)}…` : resolved
      return {title: 'Content', subtitle: truncated}
    },
  },
})
