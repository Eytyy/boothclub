import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Job opening',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'internationalizedArrayString',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment',
      type: 'string',
      options: {
        list: [
          {title: 'Full time', value: 'full-time'},
          {title: 'Part time', value: 'part-time'},
        ],
        layout: 'radio',
      },
      initialValue: 'full-time',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContentTextOnly',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
    },
    prepare({title, location}) {
      return {
        title: localizedString(title) || 'Untitled',
        subtitle: localizedString(location),
      }
    },
  },
})
