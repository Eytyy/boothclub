import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const projects = defineType({
  name: 'projects',
  title: 'Projects Page',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      description:
        'Up to 4 projects shown first on the projects page. On mobile these render as image cards; everything else renders as text rows. Leave empty for an all-text mobile listing.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (Rule) => Rule.max(4).unique(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Projects Page',
      }
    },
  },
})
