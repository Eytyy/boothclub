import {TextIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'

type CopyParent = {
  showHeadline?: boolean
  showText?: boolean
}

function hasLocalizedText(value: unknown): boolean {
  if (!Array.isArray(value)) {
    return false
  }

  return value.some((item) => {
    if (!item || typeof item !== 'object' || !('value' in item)) {
      return false
    }
    const text = (item as {value?: unknown}).value
    return typeof text === 'string' && text.trim().length > 0
  })
}

export const copyBlock = defineType({
  name: 'block.copy',
  title: 'Copy',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'showHeadline',
      title: 'Show headline',
      type: 'boolean',
      initialValue: true,
      validation: (rule) =>
        rule.custom((showHeadline, context) => {
          const parent = context.parent as CopyParent | undefined
          if (!showHeadline && !parent?.showText) {
            return 'Show at least a headline or text'
          }
          return true
        }),
    }),
    defineField({
      name: 'showText',
      title: 'Show text',
      type: 'boolean',
      initialValue: true,
      validation: (rule) =>
        rule.custom((showText, context) => {
          const parent = context.parent as CopyParent | undefined
          if (!showText && !parent?.showHeadline) {
            return 'Show at least a headline or text'
          }
          return true
        }),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayText',
      hidden: ({parent}) => !parent?.showHeadline,
      validation: (rule) =>
        rule.custom((headline, context) => {
          const parent = context.parent as CopyParent | undefined
          if (parent?.showHeadline && !hasLocalizedText(headline)) {
            return 'Headline is required'
          }
          return true
        }),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'internationalizedArrayText',
      hidden: ({parent}) => !parent?.showText,
      validation: (rule) =>
        rule.custom((text, context) => {
          const parent = context.parent as CopyParent | undefined
          if (parent?.showText && !hasLocalizedText(text)) {
            return 'Text is required'
          }
          return true
        }),
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      text: 'text',
    },
    prepare({headline, text}) {
      const snippet = localizedString(headline) || localizedString(text)
      if (!snippet.length) {
        return {title: 'Copy', subtitle: 'Empty'}
      }
      const truncated = snippet.length > 60 ? `${snippet.slice(0, 60)}…` : snippet
      return {title: 'Copy', subtitle: truncated}
    },
  },
})
