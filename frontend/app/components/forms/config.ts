import type {ContactCopy} from './copy'

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'date'
export type FieldDef = {
  name: keyof ContactCopy
  type: FieldType
  required?: boolean
  autoComplete?: string
}

/** Fields of the short contact form, in order. Labels come from the form's CMS wording. */
export const CONTACT_FIELDS: FieldDef[] = [
  {name: 'fullName', type: 'text', required: true, autoComplete: 'name'},
  {name: 'email', type: 'email', required: true, autoComplete: 'email'},
  {name: 'phone', type: 'tel', autoComplete: 'tel'},
  {name: 'message', type: 'textarea', required: true},
]

/**
 * Which form closes the home page: the multi-step quote flow or the short contact form.
 * The client is still deciding; flip this to swap them.
 */
export const HOME_CTA_VARIANT: 'quote' | 'contact' = 'quote'

/** Shared behaviour settings from a form's CMS document. */
export type FormSettings = {
  errorText?: string
  /** When set, a required consent checkbox is shown with this label. `<…>` links to the privacy policy. */
  consentText?: string
  /** When set, an optional marketing opt-in checkbox is shown with this label. */
  notificationsLabel?: string
  personalDataNote?: string
}
