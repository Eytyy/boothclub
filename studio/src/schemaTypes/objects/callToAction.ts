import {defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: BulbOutlineIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'internationalizedArrayText',
      description: 'Use {{media}} to place the media inline within the text.',
      group: 'content',
    }),
    defineField({
      name: 'button',
      type: 'button',
      group: 'content',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'video',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Images', value: 'images'},
          {title: 'GIF', value: 'gif'},
        ],
        layout: 'radio',
      },
      group: 'media',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      group: 'media',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      hidden: ({parent}) => parent?.mediaType !== 'images',
      group: 'media',
    }),
    defineField({
      name: 'gif',
      title: 'GIF',
      type: 'image',
      options: {
        accept: 'image/gif',
      },
      hidden: ({parent}) => parent?.mediaType !== 'gif',
      group: 'media',
    }),
  ],
  preview: {
    select: {
      title: 'tagline',
    },
    prepare({title}) {
      return {
        title: localizedString(title) || 'Call to Action',
        subtitle: 'Call to Action',
      }
    },
  },
})
