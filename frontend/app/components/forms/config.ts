import type {Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'

export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'date'
export type FieldDef = {
  name: string
  type: FieldType
  required?: boolean
  autoComplete?: string
}

export const FIELD_DEFS: Record<string, FieldDef[]> = {
  'contact-us': [
    {name: 'fullName', type: 'text', required: true, autoComplete: 'name'},
    {name: 'email', type: 'email', required: true, autoComplete: 'email'},
    // {name: 'company', type: 'text', autoComplete: 'organization'},
    {name: 'phone', type: 'tel', autoComplete: 'tel'},
    {name: 'message', type: 'textarea', required: true},
    // {name: 'notifications', type: 'checkbox'},
    // {name: 'consent', type: 'checkbox', required: true},
  ],
}

export function getLabels(lang: Locale) {
  const t = getDictionary(lang)

  return {
    'contact-us': {
      fullName: t['form.label.fullName'],
      email: t['form.label.email'],
      // company: t['form.label.company'],
      phone: t['form.label.phone'],
      message: t['form.label.message'],
      // notifications: t['form.label.notifications'],
      // consent: t['form.label.consent'],
      submit: t['form.label.submit'],
    },
  } as const
}
