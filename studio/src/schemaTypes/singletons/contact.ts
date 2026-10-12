import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  SearchIcon,
  ComposeSparklesIcon,
  ArrowRightIcon,
  MobileDeviceIcon,
  HelpCircleIcon,
} from '@sanity/icons'

import {localizedString} from '../../lib/i18n'

/** IANA zones offered for office hours; the site prints each as a UTC offset. */
const TIME_ZONES = [
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Qatar',
  'Asia/Kuwait',
  'Asia/Bahrain',
  'Asia/Muscat',
  'Asia/Amman',
  'Africa/Cairo',
  'Europe/London',
]

const deprecatedAddress = {
  deprecated: {reason: 'Office addresses live in Site Settings › Footer › Locations only.'},
  readOnly: true,
  hidden: ({value}: {value?: unknown}) => value === undefined,
}

export const contact = defineType({
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  groups: [
    {
      name: 'contents',
      title: 'Contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {name: 'process', title: 'What happens next', icon: ArrowRightIcon},
    {name: 'channels', title: 'Direct channels', icon: MobileDeviceIcon},
    {name: 'faq', title: 'FAQ', icon: HelpCircleIcon},
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
      name: 'form',
      title: 'Form',
      type: 'reference',
      to: [{type: 'formConfig'}],
      description: 'Legacy. The page always shows Forms › Quote Request.',
      hidden: true,
      group: 'contents',
    }),
    defineField({
      name: 'processHeading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'process',
    }),
    defineField({
      name: 'processSteps',
      title: 'Steps',
      type: 'array',
      group: 'process',
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processStep',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'body', title: 'Body', type: 'internationalizedArrayText'}),
          ],
          preview: {
            select: {title: 'title', body: 'body'},
            prepare: ({title, body}) => ({
              title: localizedString(title) || 'Untitled step',
              subtitle: localizedString(body),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'channelsHeading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'channels',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'object',
      group: 'channels',
      options: {collapsible: true},
      fields: [
        defineField({name: 'title', title: 'Title', type: 'internationalizedArrayString'}),
        defineField({name: 'body', title: 'Body', type: 'internationalizedArrayText'}),
        defineField({
          name: 'number',
          title: 'WhatsApp number',
          type: 'string',
          description: 'International format, e.g. +971 50 000 0000.',
          validation: (Rule) => Rule.regex(/^\+?[0-9 ()-]{7,20}$/, {name: 'phone number'}),
        }),
        defineField({
          name: 'message',
          title: 'Prefilled message',
          type: 'internationalizedArrayString',
          description: 'Text that opens in the visitor’s WhatsApp chat.',
        }),
        defineField({
          name: 'buttonLabel',
          title: 'Button label',
          type: 'internationalizedArrayString',
        }),
      ],
    }),
    defineField({
      name: 'phonesHeading',
      title: 'Phone heading',
      type: 'internationalizedArrayString',
      group: 'channels',
    }),
    defineField({
      name: 'phoneLines',
      title: 'Phone lines',
      type: 'array',
      group: 'channels',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phoneLine',
          fields: [
            defineField({
              name: 'city',
              title: 'City',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'number',
              title: 'Phone number',
              type: 'string',
              validation: (Rule) =>
                Rule.required().regex(/^\+?[0-9 ()-]{7,20}$/, {name: 'phone number'}),
            }),
            defineField({
              name: 'hours',
              title: 'Office hours',
              type: 'internationalizedArrayString',
              description: 'e.g. "Sun–Thu, 9:00–18:00"',
            }),
            defineField({
              name: 'timeZone',
              title: 'Time zone',
              type: 'string',
              options: {list: TIME_ZONES},
            }),
          ],
          preview: {
            select: {city: 'city', number: 'number'},
            prepare: ({city, number}) => ({
              title: localizedString(city) || 'City',
              subtitle: number,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'departmentsHeading',
      title: 'Departments heading',
      type: 'internationalizedArrayString',
      group: 'channels',
    }),
    defineField({
      name: 'departmentLines',
      title: 'Department lines',
      description: 'Press, partnerships and profit-sharing, careers.',
      type: 'array',
      group: 'channels',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'departmentLine',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'note', title: 'Note', type: 'internationalizedArrayString'}),
            defineField({
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (Rule) => Rule.email(),
            }),
            defineField({
              name: 'phone',
              title: 'Phone',
              type: 'string',
              validation: (Rule) => Rule.regex(/^\+?[0-9 ()-]{7,20}$/, {name: 'phone number'}),
            }),
          ],
          preview: {
            select: {label: 'label', email: 'email'},
            prepare: ({label, email}) => ({
              title: localizedString(label) || 'Department',
              subtitle: email,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'showroom',
      title: 'Showroom visit',
      type: 'object',
      group: 'channels',
      options: {collapsible: true},
      fields: [
        defineField({name: 'title', title: 'Title', type: 'internationalizedArrayString'}),
        defineField({name: 'body', title: 'Body', type: 'internationalizedArrayText'}),
        defineField({
          name: 'buttonLabel',
          title: 'Button label',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'link',
          title: 'Booking link',
          type: 'url',
          description: 'A booking page, or a mailto:/tel: link.',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
        }),
      ],
    }),
    defineField({
      name: 'faqHeading',
      title: 'Heading',
      type: 'internationalizedArrayString',
      group: 'faq',
    }),
    defineField({
      name: 'faq',
      title: 'Questions',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'internationalizedArrayBlockContentTextOnly',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {question: 'question'},
            prepare: ({question}) => ({title: localizedString(question) || 'Untitled question'}),
          },
        }),
      ],
    }),
    defineField({
      name: 'addressTitle',
      title: 'Address title',
      type: 'internationalizedArrayText',
      ...deprecatedAddress,
      group: 'contents',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps link',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
      ...deprecatedAddress,
      group: 'contents',
    }),
    defineField({
      name: 'mapImage',
      title: 'Map image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'internationalizedArrayString',
        }),
      ],
      ...deprecatedAddress,
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
        title: 'Contact Page',
      }
    },
  },
})
