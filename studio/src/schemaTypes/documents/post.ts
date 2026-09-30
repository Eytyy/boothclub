import {DocumentTextIcon, TagIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      icon: DocumentTextIcon,
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: TagIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
      validation: (rule) => rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({type: 'post.section'})],
      validation: (rule) => rule.required().min(1),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Preserve source slug values to keep URL parity.',
      options: {
        source: (doc) => slugFromLocalized(doc),
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'meta',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Meta Title',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'description',
          title: 'Meta Description',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'image',
          title: 'Meta Image',
          type: 'image',
          options: {hotspot: true},
        }),
      ],
      group: 'seo',
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'title',
      authorName: 'author.name',
      date: 'publishedAt',
      media: 'mainImage',
    },
    prepare({title, media, authorName, date}) {
      const author = localizedString(authorName)
      const subtitleParts = [author && `by ${author}`]
      if (date) {
        subtitleParts.push(`on ${format(parseISO(date), 'LLL d, yyyy')}`)
      }
      const subtitles = subtitleParts.filter(Boolean)

      return {title: localizedString(title) || 'Untitled', media, subtitle: subtitles.join(' ')}
    },
  },
})
