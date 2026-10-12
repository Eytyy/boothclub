'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'

import {localizedPath} from '@/app/lib/i18n/config'
import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {submitContactForm} from '@/app/lib/actions'
import {getRecaptchaToken} from '@/app/lib/recaptcha'
import type {FormKey} from './schemas'

export type FormContext = {
  url?: string
  title?: string
}

const THANK_YOU_PATH = '/thank-you'

const RECAPTCHA_ACTIONS: Record<FormKey, string> = {
  'contact-us': 'contact_submit',
  'quote-request': 'quote_submit',
}

/**
 * Sends a form through reCAPTCHA and the shared server action, then redirects to
 * the thank-you page (the conversion signal). Returns the failure message, if any.
 */
export function useFormSubmit(
  formKey: FormKey,
  {context, errorText}: {context?: FormContext; errorText?: string},
) {
  const router = useRouter()
  const lang = useLocale()
  const t = useDictionary()
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: unknown): Promise<boolean> => {
    setError(null)
    const recaptchaAction = RECAPTCHA_ACTIONS[formKey]
    let res: {success: boolean; error?: string} | undefined
    try {
      const recaptchaToken = await getRecaptchaToken(recaptchaAction)
      res = await submitContactForm({formKey, data, context, lang, recaptchaToken, recaptchaAction})
    } catch {
      res = undefined
    }

    if (res?.success) {
      // Fire a GA4 conversion before navigating; the /thank-you page view is the
      // primary destination signal, this event is a precise backup.
      // @ts-expect-error window.gtag is injected at runtime by the GA script
      window.gtag?.('event', 'generate_lead', {form: formKey})
      router.push(localizedPath(lang, THANK_YOU_PATH))
      return true
    }
    setError(res?.error ?? errorText ?? t['form.error.generic'])
    return false
  }

  return {submit, error}
}
