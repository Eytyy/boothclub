'use server'

import {stegaClean} from '@sanity/client/stega'
import {Resend} from 'resend'
import {z} from 'zod'

import {ContactSubmissionEmail} from '@/app/components/forms/ContactSubmissionEmail'
import {BodySchema, buildSchemas} from '@/app/components/forms/schemas'
import {verifyRecaptcha} from './recaptcha-server'
import {defaultLocale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {fetchFormConfigByKey} from '@/sanity/lib/data'

type ContactFormInputs = z.infer<typeof BodySchema>

const RESEND_API_KEY = process.env.RESEND_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const RESEND_SEGMENT_ID = process.env.RESEND_SEGMENT_ID
const SECRET = process.env.RECAPTCHA_SECRET_KEY!
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')

const isHoneypotTripped = (value: unknown) => typeof value === 'string' && value.length > 0

function splitFullName(fullName: string): {firstname: string; lastname: string} {
  const trimmed = fullName.trim().replace(/\s+/g, ' ')
  if (!trimmed) return {firstname: '', lastname: ''}
  const parts = trimmed.split(' ')
  if (parts.length === 1) return {firstname: parts[0], lastname: ''}
  return {
    firstname: parts[0],
    lastname: parts.slice(1).join(' '),
  }
}

function sanitizeSubject(value: string): string {
  return value
    .replace(/[\r\n\u0000-\u001f\u007f]+/g, ' ')
    // Strip zero-width/invisible characters (e.g. stega leftovers) that
    // trigger "hidden text" spam heuristics in strict filters like Microsoft 365.
    .replace(/[\u200b-\u200f\u2028-\u202e\u2060-\u2064\ufeff]+/g, '')
    .trim()
    .slice(0, 120)
}

function resolveSourceUrl(path?: string): string | undefined {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!baseUrl || !path?.startsWith('/')) return undefined
  return `${baseUrl.replace(/\/$/, '')}${path}`
}

function normalizeRecipients(recipients: unknown): string[] {
  if (!Array.isArray(recipients)) return []
  const cleaned = recipients
    .map((value) => stegaClean(String(value ?? '')).trim().toLowerCase())
    .filter((email) => z.email().safeParse(email).success)
  return [...new Set(cleaned)]
}

async function syncResendAudience({
  resend,
  email,
  firstName,
  lastName,
}: {
  resend: Resend
  email: string
  firstName: string
  lastName: string
}) {
  if (!RESEND_SEGMENT_ID) {
    console.error('[resend] missing RESEND_SEGMENT_ID; skipping audience sync')
    return
  }

  const createResult = await resend.contacts.create({
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    unsubscribed: false,
    segments: [{id: RESEND_SEGMENT_ID}],
  })

  if (!createResult.error) return

  const updateResult = await resend.contacts.update({
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    unsubscribed: false,
  })
  if (updateResult.error) {
    throw new Error(updateResult.error.message)
  }

  const segmentResult = await resend.contacts.segments.add({
    email,
    segmentId: RESEND_SEGMENT_ID,
  })
  if (segmentResult.error) {
    throw new Error(segmentResult.error.message)
  }
}

export async function submitContactForm(data: ContactFormInputs) {
  const parsed = BodySchema.safeParse(data)
  const lang = parsed.success ? (parsed.data.lang ?? defaultLocale) : defaultLocale
  const t = getDictionary(lang)

  if (!RESEND_API_KEY || !MAIL_FROM) {
    console.error('[resend] missing RESEND_API_KEY or MAIL_FROM')
    return {success: false, error: t['form.error.unavailable']}
  }

  if (!parsed.success) {
    return {success: false, error: t['form.error.invalidInput']}
  }

  const honeypot = (parsed.data.data as {website?: unknown} | undefined)?.website
  if (isHoneypotTripped(honeypot)) {
    return {success: false, error: t['form.error.verification']}
  }

  const check = await verifyRecaptcha({
    token: parsed.data.recaptchaToken,
    secret: SECRET,
    actionExpected: parsed.data.recaptchaAction,
    minScore: MIN_SCORE,
  })
  if (!check.ok) {
    console.error(
      `[recaptcha] verification failed: reason=${check.reason}` +
        (typeof check.score === 'number' ? ` score=${check.score}` : '') +
        (check.action ? ` action=${check.action}` : '') +
        (check.errorCodes?.length ? ` errorCodes=${check.errorCodes.join(',')}` : ''),
    )
    return {success: false, error: t['form.error.verification']}
  }

  try {
    const {formKey, data: formData, context} = parsed.data

    const SCHEMAS = buildSchemas(lang)
    const cleanResult = SCHEMAS[formKey].safeParse(formData)
    if (!cleanResult.success) {
      return {success: false, error: t['form.error.invalidInput']}
    }
    const clean = cleanResult.data

    const cfg = await fetchFormConfigByKey(formKey, defaultLocale)
    const recipients = normalizeRecipients(cfg?.recipients)
    if (!recipients.length) {
      console.error(`[resend] missing formConfig.recipients for key "${formKey}"`)
      return {
        success: false,
        error: t['form.error.generic'],
      }
    }

    // Page context is rendered from Sanity content, which may carry invisible
    // stega-encoding characters when visual editing is active. Clean them so
    // they never leak into the email subject or body.
    const sourceUrl = resolveSourceUrl(
      context?.url ? stegaClean(context.url) : undefined,
    )
    const sourceTitle = stegaClean(context?.title ?? '').trim() || undefined
    const subject = sanitizeSubject(
      sourceTitle
        ? `Contact form: ${clean.fullName} — ${sourceTitle}`
        : `Contact form: ${clean.fullName}`,
    )

    const resend = new Resend(RESEND_API_KEY)
    const {error} = await resend.emails.send({
      from: MAIL_FROM,
      to: recipients,
      replyTo: clean.email,
      subject,
      react: ContactSubmissionEmail({
        fullName: clean.fullName,
        email: clean.email,
        company: clean.company || undefined,
        phone: clean.phone || undefined,
        message: clean.message,
        consent: clean.consent === true,
        notifications: clean.notifications === true,
        sourceTitle,
        sourceUrl,
      }),
    })

    if (error) {
      console.error(`[resend] email send failed: ${error.message}`)
      return {
        success: false,
        error: t['form.error.generic'],
      }
    }

    if (clean.notifications === true) {
      const {firstname, lastname} = splitFullName(clean.fullName)
      try {
        await syncResendAudience({
          resend,
          email: clean.email,
          firstName: firstname,
          lastName: lastname,
        })
      } catch (audienceError) {
        console.error('[resend] audience sync failed:', audienceError)
      }
    }

    return {success: true}
  } catch (e) {
    console.error('[contact-form] unexpected error:', e)
    return {
      success: false,
      error: t['form.error.generic'],
    }
  }
}
