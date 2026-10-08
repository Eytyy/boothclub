import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  DocumentTextIcon,
  HomeIcon,
  ProjectsIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

const HERO_VISIBLE_COLUMNS = 3

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', icon: StarIcon, default: true},
    {name: 'clients', title: 'Clients', icon: UsersIcon},
    {name: 'project', title: 'Project', icon: ProjectsIcon},
    {name: 'blog', title: 'Blog', icon: DocumentTextIcon},
    {name: 'seo', title: 'SEO', icon: SearchIcon},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'headline',
          title: 'Headline',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'internationalizedArrayText',
        }),
        defineField({
          name: 'categories',
          title: 'Product Categories',
          description: `Each category becomes a column that scrolls through its “Home Page Media”. ${HERO_VISIBLE_COLUMNS} fit on screen; add more and the columns become a carousel.`,
          type: 'array',
          of: [defineArrayMember({type: 'reference', to: [{type: 'productCategory'}]})],
          validation: (rule) => rule.required().min(1).unique(),
        }),
      ],
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      group: 'clients',
      of: [defineArrayMember({type: 'reference', to: [{type: 'client'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'featuredProject',
      title: 'Featured Project',
      type: 'reference',
      group: 'project',
      to: [{type: 'project'}],
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured Blog Posts',
      type: 'array',
      group: 'blog',
      of: [defineArrayMember({type: 'reference', to: [{type: 'post'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {headline: 'hero.headline'},
    prepare({headline}) {
      return {
        title: 'Home Page',
        subtitle: localizedString(headline) || undefined,
      }
    },
  },
})
