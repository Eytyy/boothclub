import {VideoIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const videoBlock = defineType({
  name: 'block.video',
  title: 'Video',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'muxVideo',
      title: 'Mux Video',
      type: 'mux.video',
    }),
  ],
})
