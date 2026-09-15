import {z} from 'zod'

import {locales, type Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'

export function buildSchemas(lang: Locale) {
  const t = getDictionary(lang)

  const base = {
    fullName: z.string().min(1, t['form.error.requiredName']).max(120, t['form.error.max120']),
    email: z.email(t['form.error.email']),
    company: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().max(0).optional(), // honeypot field
  }

  return {
    'contact-us': z
      .object({
        ...base,
        message: z
          .string()
          .min(1, t['form.error.requiredMessage'])
          .max(5000, t['form.error.max5000'])
          .min(20, t['form.error.min20']),
        notifications: z.boolean().optional(),
        consent: z.literal(true, {message: t['form.error.consent']}),
      })
      .strict(),
  } as const
}

export const FORM_KEYS = ['contact-us'] as const
export type FormKey = (typeof FORM_KEYS)[number]

export const ContextSchema = z.object({
  title: z.string().trim().optional(),
  url: z
    .string()
    .trim()
    .regex(/^\/[A-Za-z0-9\-/_]*$/)
    .optional(),
})

export const BodySchema = z.object({
  formKey: z.enum(['contact-us']),
  data: z.unknown(),
  context: ContextSchema.optional(),
  lang: z.enum(locales).optional(),
  recaptchaToken: z.string().min(1),
  recaptchaAction: z.string().min(1),
})
