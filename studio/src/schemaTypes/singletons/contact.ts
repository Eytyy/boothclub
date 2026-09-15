import {defineField, defineType} from 'sanity'
import {SearchIcon, ComposeSparklesIcon} from '@sanity/icons'

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
      name: 'form',
      title: 'Form',
      type: 'reference',
      to: [{type: 'formConfig'}],
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'addressTitle',
      title: 'Address title',
      type: 'internationalizedArrayText',
      group: 'contents',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
      group: 'contents',
    }),
    defineField({
      name: 'mapImage',
      title: 'Map image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
        }),
      ],
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
        title: 'Contact Page',
      }
    },
  },
})
