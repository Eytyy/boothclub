import {ImagesIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const galleryBlock = defineType({
  name: 'block.gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'block.image'}), defineArrayMember({type: 'block.video'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: 'Gallery',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      }
    },
  },
})
