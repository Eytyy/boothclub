import {defineField, defineType} from 'sanity'
import {ProjectsIcon} from '@sanity/icons'

export const featuredProjects = defineType({
  name: 'featuredProjects',
  title: 'Featured Projects',
  type: 'object',
  icon: ProjectsIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'design', title: 'Design'},
    {name: 'cta', title: 'CTA'},
  ],
  fields: [
    defineField({
      name: 'items',
      title: 'Projects Items',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (rule) => rule.required().min(1),
      group: 'content',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'button',
      group: 'cta',
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare({items}) {
      const count = items?.length ?? 0
      return {
        title: 'Featured Projects',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      }
    },
  },
})
