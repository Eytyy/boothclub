import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {localizedString} from '../../lib/i18n'
import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'main',
      title: 'Main',
      default: true,
    },
    {
      name: 'footer',
      title: 'Footer',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      description: 'Site title, displayed in the header and used as default meta title',
      title: 'Title',
      type: 'internationalizedArrayString',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'description',
      description:
        'Default meta description used as fallback for pages without their own SEO description',
      title: 'Description',
      type: 'internationalizedArrayText',
      initialValue: [
        {
          _key: 'en',
          language: 'en',
          value:
            'A statically generated site using Next.js and Sanity — fast, flexible, and easy to edit.',
        },
      ],
      group: 'main',
    }),
    defineField({
      name: 'siteMenu',
      title: 'Header navigation',
      description:
        'Point to a menu with groups only. Set the menu’s CTA button label in that document to show Get in touch at the end of the last group.',
      type: 'reference',
      to: [{type: 'menu'}],
      group: 'main',
    }),
    defineField({
      name: 'footerMenu',
      title: 'Footer navigation',
      description: 'A flat list of links (e.g. Privacy Policy, Work with us).',
      type: 'array',
      of: [defineArrayMember({type: 'menuItem'})],
      group: 'footer',
    }),
    defineField({
      name: 'getInTouchCTA',
      title: 'Get in touch CTA',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button Label',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'link',
          title: 'Button link',
          type: 'link',
          options: {collapsible: true, collapsed: false},
        }),
      ],
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      group: 'footer',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'internationalizedArrayBlockContentTextOnly',
              description:
                'Address, phone, email, and other details. Highlight text and add a link annotation — choose URL (maps), Email, or Phone.',
            }),
          ],
          preview: {
            select: {title: 'name'},
            prepare({title}) {
              return {title: localizedString(title) || 'Untitled location'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'X (Twitter)', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Threads', value: 'threads'},
                ],
                layout: 'radio',
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'url',
            }),
          ],
          preview: {
            select: {label: 'label', subtitle: 'platform'},
            prepare({label, subtitle}) {
              return {
                title: localizedString(label) || subtitle || 'Social link',
                subtitle,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        // aiAssist: {
        //   imageDescriptionField: 'alt',
        // },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              const document = context.document as {ogImage?: {asset?: {_ref?: string}}}
              if (document?.ogImage?.asset?._ref && !localizedString(alt)) {
                return 'Required'
              }
              return true
            })
          },
          group: 'main',
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description:
            'Base URL for metadata. More information: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase',
        }),
      ],
      group: 'main',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
