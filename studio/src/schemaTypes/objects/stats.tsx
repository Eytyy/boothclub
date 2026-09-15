import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const stats = defineType({
  name: 'stats',
  title: 'Stats',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'internationalizedArrayString',
              description: 'Accessible text shown to screen readers (e.g. "50+")',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'number',
              title: 'Number',
              type: 'number',
              description: 'Numeric target for the rolling animation',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'suffix',
              title: 'Suffix',
              type: 'internationalizedArrayString',
              description: 'Optional suffix displayed after the number (e.g. "+")',
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              value: 'value',
              label: 'label',
            },
            prepare({value, label}) {
              return {
                title: localizedString(value) || 'Untitled',
                subtitle: localizedString(label),
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = items?.length ?? 0
      return {
        title: `Stats (${count} item${count === 1 ? '' : 's'})`,
        subtitle: 'Stats',
      }
    },
  },
})
