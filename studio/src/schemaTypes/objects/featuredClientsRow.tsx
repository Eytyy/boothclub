import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const featuredClientsRow = defineType({
  name: 'featuredClientsRow',
  title: 'Clients Tab',
  type: 'object',
  icon: ComposeIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'client'}]}],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      clients: 'clients',
    },
    prepare({heading, clients}) {
      const count = clients?.length ?? 0
      return {
        title: localizedString(heading) || 'Clients Tab',
        subtitle: `${count} client${count === 1 ? '' : 's'}`,
      }
    },
  },
})
