import {UsersIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'darkLogo',
      title: 'Dark Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'lightLogo',
      title: 'Light Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'shape',
      title: 'Logo shape',
      description:
        'Controls the bounding box aspect. Wide for horizontal wordmarks, square for badges/stacked marks, tall for vertical lockups.',
      type: 'string',
      options: {
        list: [
          {title: 'Wide', value: 'wide'},
          {title: 'Square', value: 'square'},
          {title: 'Tall', value: 'tall'},
        ],
        layout: 'radio',
      },
      initialValue: 'wide',
    }),
    defineField({
      name: 'displaySize',
      title: 'Display size',
      description:
        'Overall size of the logo in the marquee. Use sm or lg only when md feels visibly off next to the others.',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'sm'},
          {title: 'Medium', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'radio',
      },
      initialValue: 'md',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      media: 'lightLogo',
    },
    prepare({name, media}) {
      return {
        title: localizedString(name) || 'Untitled',
        media,
      }
    },
  },
})
