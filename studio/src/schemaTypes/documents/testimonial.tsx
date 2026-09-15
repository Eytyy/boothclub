import {defineField, defineType} from 'sanity'
import {CommentIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'internationalizedArrayString',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      company: 'company',
    },
    prepare({name, company}) {
      return {
        title: localizedString(name) || 'Untitled',
        subtitle: localizedString(company),
      }
    },
  },
})
