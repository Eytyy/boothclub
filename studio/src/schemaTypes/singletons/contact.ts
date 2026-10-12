import {defineArrayMember, defineField, defineType} from 'sanity'
import {SearchIcon, ComposeSparklesIcon, ArrowRightIcon, HelpCircleIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const contact = defineType({
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  groups: [
    {
      name: 'contents',
      title: 'Contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {name: 'process', title: 'What happens next', icon: ArrowRightIcon},
    {name: 'faq', title: 'FAQ', icon: HelpCircleIcon},
    {
      name: 'seo',
      title: 'SEO',
      icon: SearchIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayText',
      group: 'contents',
    }),
    defineField({
      name: 'processHeading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      type: 'array',
      group: 'process',
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'body', title: 'Body', type: 'internationalizedArrayText'}),
          ],
          preview: {
            select: {title: 'title', body: 'body'},
            prepare: ({title, body}) => ({
              title: localizedString(title) || 'Untitled step',
              subtitle: localizedString(body),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'faqHeading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'faq',
    }),
    defineField({
      name: 'faq',
      title: 'Questions',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'internationalizedArrayBlockContentTextOnly',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {question: 'question'},
            prepare: ({question}) => ({title: localizedString(question) || 'Untitled question'}),
          },
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
      }
    },
  },
})
