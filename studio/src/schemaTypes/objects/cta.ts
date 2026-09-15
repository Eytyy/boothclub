import {defineField, defineType} from 'sanity'
import {StringIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const cta = defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  icon: StringIcon,
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
    },
    prepare({headline}) {
      const title = localizedString(headline)
      return {
        title: title.length ? title : 'CTA',
        subtitle: 'CTA',
      }
    },
  },
})
