import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const team = defineType({
  name: 'team',
  title: 'Team',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      description: 'Large section title (same style as Featured Products).',
    }),
    defineField({
      name: 'members',
      title: 'Members',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'teamMember'}],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      members: 'members',
    },
    prepare({heading, members}) {
      const count = members?.length ?? 0
      return {
        title: localizedString(heading) || 'Team',
        subtitle: `${count} member${count === 1 ? '' : 's'}`,
      }
    },
  },
})
