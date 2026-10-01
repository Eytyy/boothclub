import {BlockElementIcon, ImagesIcon, TextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedBlockText} from '../../lib/i18n'
import {findSectionColumns, PostBlockSpanInput} from '../../components/PostBlockSpanInput'

type SectionBlock = {
  _key?: string
  span?: string
}

const spanField = defineField({
  name: 'span',
  title: 'Width',
  description: 'How much of this section this block occupies.',
  type: 'string',
  options: {
    list: [
      {title: 'One column', value: '1'},
      {title: 'Two columns', value: '2'},
      {title: 'Full width', value: 'full'},
    ],
    layout: 'radio',
  },
  initialValue: '1',
  hidden: ({document, parent}) =>
    findSectionColumns(document, (parent as SectionBlock | undefined)?._key) === '1',
  validation: (rule) =>
    rule.custom((span, context) => {
      const columns = findSectionColumns(
        context.document,
        (context.parent as SectionBlock | undefined)?._key,
      )
      if (columns === '1') {
        return true
      }
      if (!span) {
        return 'Width is required'
      }
      return true
    }),
  components: {
    input: PostBlockSpanInput,
  },
})

export const postContentBlock = defineType({
  name: 'post.content',
  title: 'Content',
  type: 'object',
  icon: TextIcon,
  fields: [
    spanField,
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayBlockContent',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      content: 'content',
      span: 'span',
    },
    prepare({content, span}) {
      return {
        title: localizedBlockText(content) || 'Content',
        subtitle: span === 'full' ? 'Full width' : span === '2' ? 'Two columns' : span === '1' ? 'One column' : undefined,
      }
    },
  },
})

export const postMediaBlock = defineType({
  name: 'post.media',
  title: 'Media',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    spanField,
    defineField({
      name: 'media',
      title: 'Media',
      type: 'block.media',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      mediaType: 'media.type',
      span: 'span',
      image: 'media.image',
    },
    prepare({mediaType, span, image}) {
      return {
        title: mediaType === 'video' ? 'Video' : 'Image',
        subtitle: span === 'full' ? 'Full width' : span === '2' ? 'Two columns' : span === '1' ? 'One column' : undefined,
        media: image,
      }
    },
  },
})

export const postSection = defineType({
  name: 'post.section',
  title: 'Section',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Section layout',
      description: 'How many columns this row is divided into. Blocks below sit in these columns.',
      type: 'string',
      options: {
        list: [
          {title: 'One column', value: '1'},
          {title: 'Two columns', value: '2'},
          {title: 'Three columns', value: '3'},
        ],
        layout: 'radio',
      },
      initialValue: '1',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      of: [defineArrayMember({type: 'post.content'}), defineArrayMember({type: 'post.media'})],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
      blocks: 'blocks',
    },
    prepare({columns, blocks}) {
      const count = Array.isArray(blocks) ? blocks.length : 0
      const columnLabel =
        columns === '2' ? 'Two columns' : columns === '3' ? 'Three columns' : 'One column'
      const blockLabel = count === 1 ? '1 block' : `${count} blocks`
      return {
        title: 'Section',
        subtitle: `${columnLabel}, ${blockLabel}`,
      }
    },
  },
})
