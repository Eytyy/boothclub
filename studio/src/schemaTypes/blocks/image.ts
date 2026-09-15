import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const image = defineType({
  name: 'block.image',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  description: 'Used for project listing cards.',
  options: {
    hotspot: true,
    // aiAssist: {
    //   imageDescriptionField: 'alt',
    // },
  },
  fields: [
    defineField({
      name: 'alt',
      type: 'internationalizedArrayString',
      title: 'Alternative text',
      description: 'Important for SEO and accessibility.',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'internationalizedArrayString',
      description: 'Credit the photographer or source of the image.',
    }),
  ],
})
