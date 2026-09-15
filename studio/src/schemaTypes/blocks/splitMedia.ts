import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const splitMediaBlock = defineType({
  name: 'block.splitMedia',
  title: 'Split media (2 columns)',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'left',
      title: 'Left',
      type: 'block.media',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'right',
      title: 'Right',
      type: 'block.media',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Split media',
        subtitle: 'Two columns',
      }
    },
  },
})
