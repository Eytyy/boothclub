import {defineField, defineType} from 'sanity'
import {ListIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

/** One choice in a form's option list (event type, city, extra, contact method). */
export const formOption = defineType({
  name: 'formOption',
  title: 'Option',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'The English label is what the team sees in the notification email.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'internationalizedArrayString',
      description: 'Optional one-line description shown under the label.',
    }),
  ],
  preview: {
    select: {label: 'label', note: 'note'},
    prepare({label, note}) {
      return {title: localizedString(label) || 'Untitled option', subtitle: localizedString(note)}
    },
  },
})

/** A booth choice in the quote form. Link a product to reuse its title, or write a label. */
export const boothOption = defineType({
  name: 'boothOption',
  title: 'Booth option',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      description: 'Leave empty for choices that are not a product (e.g. "Not sure yet").',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Overrides the product title. Required when no product is linked.',
      validation: (rule) =>
        rule.custom((label, context) => {
          const parent = context.parent as {product?: {_ref?: string}} | undefined
          if (!parent?.product?._ref && !localizedString(label)) {
            return 'Add a label or link a product'
          }
          return true
        }),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'internationalizedArrayString',
      description: 'Optional one-line description shown under the label.',
    }),
  ],
  preview: {
    select: {label: 'label', productTitle: 'product.title', note: 'note'},
    prepare({label, productTitle, note}) {
      return {
        title: localizedString(label) || localizedString(productTitle) || 'Untitled booth',
        subtitle: localizedString(note),
      }
    },
  },
})
