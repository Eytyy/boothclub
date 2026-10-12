import {z} from 'zod'

import {locales, type Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'

export type SchemaOptions = {
  /** The consent checkbox is shown (and required) only when the form has consent text in the CMS. */
  requireConsent?: boolean
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Today's date as YYYY-MM-DD, one day back so visitors west of the server are not rejected. */
const earliestEventDate = () =>
  new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

export function buildSchemas(lang: Locale, {requireConsent = false}: SchemaOptions = {}) {
  const t = getDictionary(lang)

  const base = {
    fullName: z
      .string()
      .trim()
      .min(1, t['form.error.requiredName'])
      .max(120, t['form.error.max120']),
    email: z.email(t['form.error.email']),
    company: z.string().max(120, t['form.error.max120']).optional(),
    phone: z.string().max(40).optional(),
    website: z.string().max(0).optional(), // honeypot field
    notifications: z.boolean().optional(),
    consent: requireConsent
      ? z.literal(true, {message: t['form.error.consent']})
      : z.boolean().optional(),
  }

  const choice = z.string().trim().min(1, t['form.error.requiredChoice']).max(120)
  const choices = z.array(z.string().trim().min(1).max(120)).max(30)

  return {
    'contact-us': z
      .object({
        ...base,
        message: z
          .string()
          .min(1, t['form.error.requiredMessage'])
          .max(5000, t['form.error.max5000'])
          .min(20, t['form.error.min20']),
      })
      .strict(),
    'quote-request': z
      .object({
        ...base,
        // Producers call to finalize, so the quote form needs a number.
        phone: z
          .string()
          .trim()
          .regex(/^\+?[0-9 ()-]{7,20}$/, t['form.error.phone']),
        eventType: choice,
        city: choice,
        date: z
          .string()
          .regex(ISO_DATE, t['form.error.requiredDate'])
          .refine((d) => d >= earliestEventDate(), t['form.error.pastDate']),
        guests: z
          .string()
          .trim()
          .regex(/^\d{0,6}$/, t['form.error.guests'])
          .optional(),
        booths: choices,
        extras: choices,
        notes: z.string().max(5000, t['form.error.max5000']).optional(),
        contactMethod: choice,
      })
      .strict(),
  } as const
}

export const FORM_KEYS = ['contact-us', 'quote-request'] as const
export type FormKey = (typeof FORM_KEYS)[number]

export type ContactValues = z.infer<ReturnType<typeof buildSchemas>['contact-us']>
export type QuoteValues = z.infer<ReturnType<typeof buildSchemas>['quote-request']>

export const ContextSchema = z.object({
  title: z.string().trim().optional(),
  url: z
    .string()
    .trim()
    .regex(/^\/[A-Za-z0-9\-/_]*$/)
    .optional(),
})

export const BodySchema = z.object({
  formKey: z.enum(FORM_KEYS),
  data: z.unknown(),
  context: ContextSchema.optional(),
  lang: z.enum(locales).optional(),
  recaptchaToken: z.string().min(1),
  recaptchaAction: z.string().min(1),
})
