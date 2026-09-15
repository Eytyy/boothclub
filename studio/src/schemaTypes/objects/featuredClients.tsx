import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const featuredClients = defineType({
  name: 'featuredClients',
  title: 'Featured Clients',
  type: 'object',
  icon: UsersIcon,
  groups: [{name: 'content', title: 'Content', default: true}],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'content',
    }),
    defineField({
      name: 'rows',
      title: 'Tabs',
      type: 'array',
      of: [{type: 'featuredClientsRow'}],
      validation: (rule) => rule.required().min(1),
      group: 'content',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'testimonial'}]}],
      group: 'content',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      rows: 'rows',
      testimonials: 'testimonials',
    },
    prepare({title, rows, testimonials}) {
      const rowCount = rows?.length ?? 0
      let clientCount = 0
      if (Array.isArray(rows)) {
        for (const row of rows) {
          const r = row as {clients?: unknown[]}
          clientCount += r?.clients?.length ?? 0
        }
      }
      const testimonialCount = testimonials?.length ?? 0
      const parts = [
        `${rowCount} row${rowCount === 1 ? '' : 's'}`,
        `${clientCount} client${clientCount === 1 ? '' : 's'}`,
        `${testimonialCount} testimonial${testimonialCount === 1 ? '' : 's'}`,
      ]
      return {
        title: localizedString(title) || 'Featured Clients',
        subtitle: parts.join(', '),
      }
    },
  },
})
