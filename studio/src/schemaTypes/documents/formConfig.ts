import {defineArrayMember, defineField, defineType} from 'sanity'

const FORM_KEYS = [
  {title: 'Contact Us (short form at the end of inner pages)', value: 'contact-us'},
  {title: 'Quote Request (multi-step form on the Contact page)', value: 'quote-request'},
] as const
const MAX_RECIPIENTS = 10

export default defineType({
  name: 'formConfig',
  title: 'Form Config',
  type: 'document',
  groups: [
    {name: 'delivery', title: 'Delivery', default: true},
    {name: 'wording', title: 'Wording'},
    {name: 'messages', title: 'Messages & consent'},
  ],
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      title: 'Form Key',
      description: 'Unique identifier for the form.',
      options: {
        list: FORM_KEYS.map(({title, value}) => ({title, value})),
        layout: 'radio',
      },
      validation: (r) => r.required(),
      readOnly: ({document}) => Boolean(document?.key),
      group: 'delivery',
    }),
    defineField({
      name: 'contactCopy',
      title: 'Wording',
      type: 'contactFormCopy',
      group: 'wording',
      hidden: ({document}) => document?.key !== 'contact-us',
    }),
    defineField({
      name: 'quoteCopy',
      title: 'Wording',
      type: 'quoteFormCopy',
      group: 'wording',
      hidden: ({document}) => document?.key !== 'quote-request',
    }),
    defineField({
      name: 'recipients',
      title: 'Notification Recipients',
      type: 'array',
      description:
        'Internal email addresses that receive a Resend notification when this form is submitted.',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (r) => r.required().email(),
        }),
      ],
      validation: (r) =>
        r
          .required()
          .min(1)
          .max(MAX_RECIPIENTS)
          .unique()
          .error(`Add between 1 and ${MAX_RECIPIENTS} unique recipient emails.`),
      group: 'delivery',
    }),
    defineField({
      name: 'successMessage',
      type: 'internationalizedArrayText',
      description: 'Not currently shown: a successful submission goes to the thank-you page.',
      group: 'messages',
    }),
    defineField({
      name: 'errorText',
      type: 'internationalizedArrayText',
      description: 'Shown to the user when the submission fails.',
      group: 'messages',
    }),
    defineField({
      name: 'consentText',
      type: 'internationalizedArrayText',
      description:
        'Leave empty to hide the consent checkbox. When set, visitors must tick it to submit. Use <Privacy Policy> to insert a link to the privacy policy page inside the label.',
      group: 'messages',
    }),
    defineField({
      name: 'notificationsLabel',
      type: 'internationalizedArrayString',
      description:
        'Label for the optional marketing opt-in checkbox (e.g. "Send me ideas and new booth launches now and then."). Leave empty to hide it.',
      group: 'messages',
    }),
    defineField({
      name: 'personalDataNote',
      type: 'internationalizedArrayText',
      description:
        'Helper note rendered below the consent checkboxes (e.g. "We only use personal data to contact you further and to send you information about our services.").',
      group: 'messages',
    }),
    defineField({
      name: 'privacyPage',
      type: 'reference',
      to: [{type: 'privacyPolicy'}],
      group: 'messages',
    }),
  ],
  preview: {
    select: {title: 'key', recipients: 'recipients'},
    prepare({title, recipients}) {
      const count = Array.isArray(recipients) ? recipients.length : 0
      return {
        title:
          FORM_KEYS.find((k) => k.value === title)?.title.split(' (')[0] || title || 'Form Config',
        subtitle: count ? `${count} recipient${count === 1 ? '' : 's'}` : 'No recipients',
      }
    },
  },
})
