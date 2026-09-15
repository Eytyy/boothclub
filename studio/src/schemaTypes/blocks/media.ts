import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const mediaBlock = defineType({
  name: 'block.media',
  title: 'Media Block',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: ['image', 'video'],
      },
      initialValue: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'block.image',
      hidden: ({parent}) => parent?.type !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'block.video',
      hidden: ({parent}) => parent?.type !== 'video',
    }),
  ],
})
