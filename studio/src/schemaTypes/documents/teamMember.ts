import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fields: [
        defineField({
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: 'name',
      role: 'role',
      image: 'image',
    },
    prepare(selection) {
      return {
        title: localizedString(selection.name) || 'Untitled',
        subtitle: localizedString(selection.role) || 'Team Member',
        media: selection.image,
      }
    },
  },
})
