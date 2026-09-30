import {ComposeSparklesIcon, ImageIcon, SearchIcon, TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {localizedString, slugFromLocalized} from '../../lib/i18n'

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Product Category',
  icon: TagIcon,
  type: 'document',
  groups: [
    {name: 'contents', title: 'Contents', icon: ComposeSparklesIcon, default: true},
    {name: 'media', title: 'Media', icon: ImageIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'internationalizedArrayString',
      group: 'contents',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayBlockContentTextOnly',
      validation: (rule) => rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => slugFromLocalized(doc),
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'project'}],
          options: {
            filter: ({
              document,
            }: {
              document?: {_id?: string; featuredProjects?: Array<{_ref?: string}>}
            }) => {
              const categoryId = document?._id?.replace('drafts.', '')
              const selectedRefs =
                document?.featuredProjects
                  ?.map((item) => item?._ref)
                  .filter((ref): ref is string => Boolean(ref)) ?? []

              return {
                filter:
                  '(!defined($categoryId) || product->category._ref == $categoryId) && !(_id in $selectedRefs)',
                params: {categoryId, selectedRefs},
              }
            },
          },
        },
      ],
      group: 'contents',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'block.image',
      validation: (rule) => rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'mux.video',
      description:
        'Optional Mux video shown at the top of the category page in place of the main image. Falls back to the main image if not set.',
      group: 'media',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      slug: 'slug.current',
    },
    prepare({title, media, slug}) {
      return {
        title: localizedString(title) || 'Untitled',
        media,
        subtitle: slug ? `/${slug}` : 'No slug',
      }
    },
  },
})
