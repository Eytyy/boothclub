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
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayString',
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
      headline: 'headline',
      members: 'members',
    },
    prepare({headline, members}) {
      const count = members?.length ?? 0
      return {
        title: localizedString(headline) || 'Team',
        subtitle: `${count} member${count === 1 ? '' : 's'}`,
      }
    },
  },
})
