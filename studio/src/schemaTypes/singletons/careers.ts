import {defineField, defineType} from 'sanity'
import {SearchIcon, ComposeSparklesIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const careers = defineType({
  name: 'careers',
  title: 'Careers Page',
  type: 'document',
  groups: [
    {
      name: 'contents',
      title: 'Contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
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
      name: 'intro',
      title: 'Intro',
      type: 'internationalizedArrayText',
      group: 'contents',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'block.image',
      group: 'contents',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      group: 'contents',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'internationalizedArrayString',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'internationalizedArrayText',
            }),
          ],
          preview: {
            select: {headline: 'headline'},
            prepare({headline}) {
              return {title: localizedString(headline) || 'Untitled benefit'}
            },
          },
        },
      ],
    }),
    defineField({
      name: 'jobOpenings',
      title: 'Job openings',
      type: 'array',
      group: 'contents',
      of: [{type: 'reference', to: [{type: 'jobOpening'}]}],
    }),
    defineField({
      name: 'applyEmail',
      title: 'Apply email',
      type: 'string',
      description: 'Used for Quick Apply links (mailto).',
      validation: (r) => r.email().required(),
      group: 'contents',
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
        title: 'Careers Page',
      }
    },
  },
})
