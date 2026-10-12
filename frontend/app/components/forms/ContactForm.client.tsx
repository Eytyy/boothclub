'use client'
import * as React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {CONTACT_FIELDS, type FormSettings} from './config'
import type {ContactCopy} from './copy'
import {buildSchemas, type ContactValues} from './schemas'
import Field, {FieldError, FieldLabel} from './Field'
import Input from './Input'
import SubmitButton from './SubmitButton'
import {Honeypot} from './HoneyPot'
import RecaptchaNotice from './RecaptchaNotice.client'
import {ConsentFields} from './ConsentFields'
import SubmissionError from './SubmissionError.client'
import {useFormSubmit, type FormContext} from './useFormSubmit'

export type {FormContext}

type Props = {
  copy: ContactCopy
  settings: FormSettings
  context?: FormContext
  /** Starting text for the message field, e.g. the product the visitor is looking at. */
  defaultMessage?: string
}

export default function ContactForm({copy, settings, context, defaultMessage}: Props) {
  const lang = useLocale()
  const t = useDictionary()
  const idPrefix = React.useId()

  const schema = buildSchemas(lang, {requireConsent: Boolean(settings.consentText)})['contact-us']
  const defaultValues = React.useMemo(() => ({message: defaultMessage ?? ''}), [defaultMessage])

  const {
    formState: {errors, isSubmitting},
    register,
    handleSubmit,
    reset,
  } = useForm<ContactValues>({resolver: zodResolver(schema), defaultValues})

  const {submit, error} = useFormSubmit('contact-us', {context, errorText: settings.errorText})

  const onValid = async (values: ContactValues) => {
    if (await submit(values)) reset(defaultValues)
  }

  const errorsMap = errors as Record<string, {message?: string} | undefined>

  return (
    <form
      noValidate
      aria-busy={isSubmitting || undefined}
      onSubmit={handleSubmit(onValid)}
      className="p-10 space-y-10"
    >
      {error ? <SubmissionError message={error} /> : null}
      {CONTACT_FIELDS.map((f) => {
        const id = `${idPrefix}-${f.name}`
        return (
          <Field key={f.name}>
            <FieldLabel htmlFor={id}>{copy[f.name]}</FieldLabel>
            <Input f={f} register={register} errors={errors} id={id} errId={`${id}-error`} />
            <FieldError id={`${id}-error`} message={errorsMap[f.name]?.message} />
          </Field>
        )
      })}
      <Honeypot register={register} />
      <ConsentFields
        settings={settings}
        register={register}
        errors={errors}
        lang={lang}
        idPrefix={idPrefix}
      />
      <RecaptchaNotice />

      <SubmitButton
        className="self-end"
        disabled={isSubmitting}
        isSubmitting={isSubmitting}
        label={copy.submit}
        submittingLabel={t['form.label.submitting']}
        lang={lang}
      />
    </form>
  )
}
