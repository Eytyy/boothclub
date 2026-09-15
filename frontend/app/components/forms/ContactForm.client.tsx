'use client'
import * as React from 'react'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import type {z} from 'zod'
import {FIELD_DEFS, getLabels} from './config'
import {buildSchemas, FormKey} from './schemas'
import {localizedPath} from '@/app/lib/i18n/config'
import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {formatPrivacyNote} from '@/app/lib/utils'
import {submitContactForm} from '@/app/lib/actions'
import Field, {FieldError, FieldLabel} from './Field'
import Input from './Input'
import SubmitButton from './SubmitButton'
import {getRecaptchaToken} from '@/app/lib/recaptcha'
import {Honeypot} from './HoneyPot'
import RecaptchaNotice from './RecaptchaNotice.client'

export type FormContext = {
  url?: string
  title?: string
}

type Props = {
  formKey: FormKey
  privacyHref: string // from CMS
  // Accepted for backwards compatibility; success now redirects to the
  // thank-you page (for conversion tracking) rather than showing inline copy.
  successText?: string // from CMS
  errorText?: string // from CMS
  consentText?: string // from CMS
  notificationsLabel?: string // from CMS
  personalDataNote?: string // from CMS
  context?: FormContext
}

const THANK_YOU_PATH = '/thank-you'

export default function ContactForm({
  formKey,
  consentText,
  privacyHref,
  context,
  errorText,
  notificationsLabel,
  personalDataNote,
}: Props) {
  const router = useRouter()
  const lang = useLocale()
  const t = useDictionary()
  const fields = FIELD_DEFS[formKey]
  const L = getLabels(lang)[formKey]

  const textFields = React.useMemo(() => fields.filter((f) => f.type !== 'checkbox'), [fields])

  const SCHEMAS = buildSchemas(lang)
  const schema = SCHEMAS[formKey]
  type Schema = z.infer<typeof schema>

  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit,
    reset,
  } = useForm<Schema>({resolver: zodResolver(schema)})

  const [submissionError, setSubmissionError] = React.useState<string | null>(null)

  const submit = async (v: Schema) => {
    setSubmissionError(null)

    const recaptchaAction = 'contact_submit'
    const recaptchaToken = await getRecaptchaToken(recaptchaAction)
    const res = await submitContactForm({
      formKey,
      data: v,
      context,
      lang,
      recaptchaToken,
      recaptchaAction,
    })
    if (res?.success) {
      reset()
      // Fire a GA4 conversion before navigating; the /thank-you page view is the
      // primary destination signal, this event is a precise backup.
      // @ts-expect-error window.gtag is injected at runtime by the GA script
      window.gtag?.('event', 'generate_lead', {form: formKey})
      router.push(localizedPath(lang, THANK_YOU_PATH))
    } else {
      setSubmissionError(res?.error ?? errorText ?? t['form.error.generic'])
    }
  }

  const consentLabelNode = consentText
    ? (formatPrivacyNote({privacyNote: consentText, privacySlug: privacyHref, lang}) ?? consentText)
    : L.consent

  const notificationsLabelText = notificationsLabel ?? L.notifications

  const errorsMap = errors as Record<string, {message?: string} | undefined>

  return (
    <form
      noValidate
      aria-busy={isSubmitting || undefined}
      onSubmit={handleSubmit(submit)}
      className="space-y-8 "
    >
      {submissionError ? <SubmissionError message={submissionError} /> : null}
      {textFields.map((f) => (
        <Field key={f.name}>
          <FieldLabel htmlFor={f.name}>{L[f.name as keyof typeof L]}</FieldLabel>

          <Input f={f} register={register} errors={errors} id={f.name} errId={f.name + '-error'} />
          <FieldError id={f.name + '-error'} message={errorsMap[f.name]?.message} />
        </Field>
      ))}
      <Honeypot register={register} />

      <div className="space-y-4 rounded-lg border border-black/20 p-5 dark:border-white/20">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Input
                f={{name: 'notifications', type: 'checkbox'}}
                id="notifications"
                register={register}
                errors={errors}
                errId="notifications-error"
                className="mt-1 h-4 w-4 shrink-0"
              />
              <FieldLabel htmlFor="notifications" className="text-sm font-normal leading-snug">
                {notificationsLabelText}
              </FieldLabel>
            </div>
            <FieldError id="notifications-error" message={errorsMap.notifications?.message} />
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-3">
              <Input
                f={{name: 'consent', type: 'checkbox', required: true}}
                id="consent"
                register={register}
                errors={errors}
                errId="consent-error"
                className="mt-1 h-4 w-4 shrink-0"
              />
              <FieldLabel htmlFor="consent" className="text-sm font-normal leading-snug">
                {consentLabelNode}
              </FieldLabel>
            </div>
            <FieldError id="consent-error" message={errorsMap.consent?.message} />
          </div>
        </div>

        {personalDataNote ? <p className="text-sm opacity-80">{personalDataNote}</p> : null}
      </div>

      <SubmitButton
        disabled={isSubmitting}
        isSubmitting={isSubmitting}
        label={L.submit}
        submittingLabel={t['form.label.submitting']}
      />
      <RecaptchaNotice />
    </form>
  )
}

function SubmissionError({message}: {message: string}) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800"
    >
      {message}
    </div>
  )
}
