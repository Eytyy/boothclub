import {defineField, defineType} from 'sanity'
import {HomeIcon, StarIcon, MasterDetailIcon, SearchIcon} from '@sanity/icons'

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      name: 'hero',
      title: 'Hero',
      icon: StarIcon,
      default: true,
    },
    {
      name: 'pageBuilder',
      title: 'Page Builder',
      icon: MasterDetailIcon,
    },
    {
      name: 'seo',
      title: 'SEO',
      icon: SearchIcon,
    },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'internationalizedArrayText',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subheadline',
          title: 'Sub-headline',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'video',
          type: 'mux.video',
          title: 'Hero Video',
        }),
        defineField({
          name: 'taglineWithVideo',
          title: 'Tagline with Video',
          type: 'internationalizedArrayText',
          description:
            'Use {{video}} to place the video inline. e.g. "We don\'t just tell {{video}} stories."',
        }),
      ],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      group: 'pageBuilder',
      of: [
        {type: 'callToAction'},
        {type: 'featuredProducts'},
        {type: 'featuredClients'},
        {type: 'featuredBlog'},
      ],
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'featuredProjects',
      group: 'hero',
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
        title: 'Home Page',
      }
    },
  },
})
