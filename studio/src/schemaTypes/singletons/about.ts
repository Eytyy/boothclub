import {defineField, defineType} from 'sanity'
import {InfoOutlineIcon, SearchIcon, ComposeSparklesIcon} from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  icon: InfoOutlineIcon,
  groups: [
    {
      name: 'contents',
      title: 'Contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: SearchIcon,
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'internationalizedArrayText',
      group: 'contents',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        {type: 'block.text'},
        {type: 'block.media'},
        {type: 'block.contentSection'},
        {type: 'stats'},
        {type: 'team'},
        {type: 'cta'},
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
      group: 'contents',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
      }
    },
  },
})
