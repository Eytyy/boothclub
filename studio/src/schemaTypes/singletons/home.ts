import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  DocumentTextIcon,
  HomeIcon,
  ProjectsIcon,
  SearchIcon,
  StarIcon,
  TagsIcon,
  UsersIcon,
} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

const HERO_COLUMN_COUNT = 3

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', icon: StarIcon, default: true},
    {name: 'products', title: 'Products', icon: TagsIcon},
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
          name: 'columns',
          title: 'Columns',
          description: `Exactly ${HERO_COLUMN_COUNT} columns. Each column scrolls through its items on a loop.`,
          type: 'array',
          of: [
            defineArrayMember({
              name: 'heroColumn',
              title: 'Column',
              type: 'object',
              fields: [
                defineField({
                  name: 'items',
                  title: 'Items',
                  type: 'array',
                  of: [
                    defineArrayMember({type: 'block.media'}),
                    defineArrayMember({type: 'block.text'}),
                  ],
                  validation: (rule) => rule.required().min(1),
                }),
              ],
              preview: {
                select: {items: 'items'},
                prepare({items}) {
                  const count = items?.length ?? 0
                  return {
                    title: 'Column',
                    subtitle: `${count} item${count === 1 ? '' : 's'}`,
                  }
                },
              },
            }),
          ],
          validation: (rule) => rule.required().length(HERO_COLUMN_COUNT),
        }),
      ],
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'object',
      group: 'products',
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
          type: 'array',
          of: [defineArrayMember({type: 'reference', to: [{type: 'productCategory'}]})],
          validation: (rule) => rule.unique(),
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
    select: {headline: 'featuredProducts.headline'},
    prepare({headline}) {
      return {
        title: 'Home Page',
        subtitle: localizedString(headline) || undefined,
      }
    },
  },
})
