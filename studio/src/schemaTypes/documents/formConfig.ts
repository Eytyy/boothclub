import {defineArrayMember, defineField, defineType} from 'sanity'

const FORM_KEYS = [{title: 'Contact Us', value: 'contact-us'}] as const
const MAX_RECIPIENTS = 10

export default defineType({
  name: 'formConfig',
  title: 'Form Config',
  type: 'document',
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
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
      description: 'Short intro/description shown above the form (optional).',
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
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot Form ID (Deprecated)',
      type: 'string',
      description: 'Legacy HubSpot form GUID. Retained for existing production documents only.',
      deprecated: {
        reason:
          'Form delivery now uses Resend. Configure notification recipients on this document instead.',
      },
      readOnly: true,
      hidden: ({value}) => value === undefined,
      initialValue: undefined,
    }),
    defineField({
      name: 'successMessage',
      type: 'internationalizedArrayText',
      description: 'Shown to the user after a successful submission.',
    }),
    defineField({
      name: 'errorText',
      type: 'internationalizedArrayText',
      description: 'Shown to the user when the submission fails.',
    }),
    defineField({
      name: 'consentText',
      type: 'internationalizedArrayText',
      description:
        'Rendered as the required consent checkbox label. Use <Privacy Policy> to insert a link to the privacy policy page inside the label.',
    }),
    defineField({
      name: 'notificationsLabel',
      type: 'internationalizedArrayString',
      description:
        'Label for the optional marketing opt-in checkbox (e.g. "I agree to receive notifications.").',
    }),
    defineField({
      name: 'personalDataNote',
      type: 'internationalizedArrayText',
      description:
        'Helper note rendered below the consent checkboxes (e.g. "We only use personal data to contact you further and to send you information about our services.").',
    }),
    defineField({
      name: 'notificationsSubscriptionTypeId',
      type: 'number',
      title: 'HubSpot Subscription Type ID (Deprecated)',
      description:
        'Legacy HubSpot subscription type ID. Retained for existing production documents only.',
      deprecated: {
        reason:
          'Marketing opt-in is now synced to a Resend Segment via RESEND_SEGMENT_ID. This HubSpot field is no longer used.',
      },
      readOnly: true,
      hidden: ({value}) => value === undefined,
      initialValue: undefined,
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: 'privacyPage',
      type: 'reference',
      to: [{type: 'privacyPolicy'}],
    }),
  ],
  preview: {
    select: {title: 'key', recipients: 'recipients'},
    prepare({title, recipients}) {
      const count = Array.isArray(recipients) ? recipients.length : 0
      return {
        title: title || 'Form Config',
        subtitle: count ? `${count} recipient${count === 1 ? '' : 's'}` : 'No recipients',
      }
    },
  },
})
