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
      name: 'firstName',
      title: 'First Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'picture',
      title: 'Picture',
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
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'internationalizedArrayText',
      description: 'Short bio shown when a visitor selects this team member.',
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      picture: 'picture',
    },
    prepare(selection) {
      const firstName = localizedString(selection.firstName)
      const lastName = localizedString(selection.lastName)
      return {
        title: [firstName, lastName].filter(Boolean).join(' ') || 'Untitled',
        subtitle: 'Team Member',
        media: selection.picture,
      }
    },
  },
})
