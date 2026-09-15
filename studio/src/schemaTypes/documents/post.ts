import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
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
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayBlockContent',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
        // aiAssist: {
        //   imageDescriptionField: 'alt',
        // },
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
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
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
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'Optional explicit canonical URL. If omitted, frontend derives /blog/[slug].',
    }),
    defineField({
      name: 'sourceId',
      title: 'Contentful Source ID',
      type: 'string',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      initialValue: 'contentful',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'sourceUpdatedAt',
      title: 'Source Updated At',
      type: 'datetime',
      hidden: true,
      readOnly: true,
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
