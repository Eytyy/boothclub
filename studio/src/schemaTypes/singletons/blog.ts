import {defineField, defineType} from 'sanity'
import {DocumentsIcon} from '@sanity/icons'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Page',
  type: 'document',
  icon: DocumentsIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blogPostFooter',
      title: 'Blog Post Footer',
      description:
        'Rendered at the end of every blog post detail page (after the body, before related posts). Use this for marketing CTAs, sign-offs, or recurring boilerplate.',
      type: 'internationalizedArrayBlockContent',
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
        title: 'Blog Page',
      }
    },
  },
})
