import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'internationalizedArrayString',
      description: 'If omitted, the main title will be used.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'internationalizedArrayText',
      description:
        'Keep it short and concise. Aim for 155 characters or less. If omitted, the main description will be used as a fallback.',
    }),
    defineField({
      name: 'metaImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {hotspot: true},
      description: 'If omitted, the main image will be used.',
    }),
  ],
})
