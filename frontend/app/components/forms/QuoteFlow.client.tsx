'use client'
import * as React from 'react'
import {useForm, useWatch, type FieldErrors, type UseFormRegister} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {cn} from '@/app/lib/utils'
import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import Button from '@/app/components/ui/Button'
import ArrowIcon from '@/app/components/ui/icons/ArrowIcon'
import TextReveal from '@/app/components/ui/TextReveal.client'
import type {FormSettings} from './config'
import {fillTemplate, type FormOption, type QuoteCopy} from './copy'
import {buildSchemas, type QuoteValues} from './schemas'
import Field, {FieldError, FieldLabel} from './Field'
import Input from './Input'
import SubmitButton from './SubmitButton'
import {Honeypot} from './HoneyPot'
import RecaptchaNotice from './RecaptchaNotice.client'
import {ConsentFields} from './ConsentFields'
import SubmissionError from './SubmissionError.client'
import {useFormSubmit, type FormContext} from './useFormSubmit'

/**
 * The multi-step "Get a quote" flow. Each step validates before moving on; the last
 * one sends every answer through the shared form action. Pricing is case by case
 * (B2B), so no estimate is shown on the site.
 */

type Props = {
  copy: QuoteCopy
  settings: FormSettings
  context?: FormContext
  className?: string
}

/** Fields owned by each step, validated when the visitor continues. */
const STEP_FIELDS: (keyof QuoteValues)[][] = [
  ['eventType', 'city', 'date', 'guests'],
  ['booths'],
  ['extras', 'notes'],
  ['fullName', 'company', 'email', 'phone', 'contactMethod', 'notifications', 'consent'],
]
const LAST_STEP = STEP_FIELDS.length - 1

type Errors = Record<string, {message?: string} | undefined>

export default function QuoteFlow({copy, settings, context, className}: Props) {
  const lang = useLocale()
  const t = useDictionary()
  const id = React.useId()
  const [step, setStep] = React.useState(0)
  const statusRef = React.useRef<HTMLParagraphElement>(null)
  const movedRef = React.useRef(false)

  const schema = buildSchemas(lang, {requireConsent: Boolean(settings.consentText)})[
    'quote-request'
  ]
  const defaultValues = React.useMemo<Partial<QuoteValues>>(
    () => ({
      eventType: copy.eventTypes[0]?.value ?? '',
      city: copy.cities[0]?.value ?? '',
      date: '',
      guests: '',
      booths: [],
      extras: [],
      notes: '',
      fullName: '',
      company: '',
      email: '',
      phone: '',
      contactMethod: copy.contactMethods[0]?.value ?? '',
    }),
    [copy],
  )

  const {
    register,
    handleSubmit,
    trigger,
    control,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<QuoteValues>({resolver: zodResolver(schema), defaultValues})

  const {submit, error} = useFormSubmit('quote-request', {context, errorText: settings.errorText})

  // Move focus to the step status after Back/Continue so the new step is announced.
  React.useEffect(() => {
    if (!movedRef.current) return
    statusRef.current?.focus()
  }, [step])

  const goTo = (next: number) => {
    movedRef.current = true
    setStep(next)
  }

  const onValid = async (values: QuoteValues) => {
    if (await submit(values)) {
      reset(defaultValues)
    }
  }

  // Only reachable if an earlier step became invalid; send the visitor back to it.
  const onInvalid = (errs: FieldErrors<QuoteValues>) => {
    const first = STEP_FIELDS.findIndex((fields) => fields.some((f) => f in errs))
    if (first >= 0 && first !== step) goTo(first)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (step < LAST_STEP) {
      event.preventDefault()
      if (await trigger(STEP_FIELDS[step], {shouldFocus: true})) goTo(step + 1)
      return
    }
    await handleSubmit(onValid, onInvalid)(event)
  }

  const steps = [copy.basicsStep, copy.boothsStep, copy.extrasStep, copy.detailsStep]
  const boothCount = (useWatch({control, name: 'booths'}) ?? []).length
  const stepProps = {copy, register, errors: errors as Errors, id}

  return (
    <section className={cn('grid lg:grid-cols-2', className)} aria-labelledby={`${id}-title`}>
      <div className="p-5 lg:p-10 space-y-5">
        <h2 id={`${id}-title`} className="text-sm font-semibold uppercase tracking-wide">
          {copy.eyebrow}
        </h2>
        <TextReveal className="text-reveal-default" text={copy.heading} />
        <p className="body-text max-w-150">{copy.description}</p>
      </div>

      <div className="border-t-site lg:border-t-0 lg:border-s-site border-black dark:border-white">
        <form
          noValidate
          aria-busy={isSubmitting || undefined}
          aria-labelledby={`${id}-title`}
          onSubmit={onSubmit}
          className="p-5 lg:p-10 space-y-10"
        >
          {error ? <SubmissionError message={error} /> : null}

          <div className="space-y-3">
            <p
              ref={statusRef}
              tabIndex={-1}
              className="flex justify-between gap-5 text-sm font-semibold uppercase tracking-wide focus:outline-none"
            >
              <span>
                {fillTemplate(copy.stepCounter, {current: step + 1, total: steps.length})}
              </span>
              <span>{steps[step]}</span>
            </p>
            <div
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={steps.length}
              aria-valuenow={step + 1}
              aria-valuetext={`${fillTemplate(copy.stepCounter, {current: step + 1, total: steps.length})}: ${steps[step]}`}
              aria-label={t['form.quote.progress']}
              className="h-1 bg-black/20 dark:bg-white/20"
            >
              <div
                className="h-full bg-black dark:bg-white transition-[width]"
                style={{width: `${((step + 1) / steps.length) * 100}%`}}
              />
            </div>
          </div>

          {step === 0 && <StepBasics {...stepProps} />}
          {step === 1 && <StepBooths {...stepProps} />}
          {step === 2 && <StepExtras {...stepProps} />}
          {step === LAST_STEP && (
            <>
              <StepDetails {...stepProps} />
              <ConsentFields
                settings={settings}
                register={register}
                errors={errors}
                lang={lang}
                idPrefix={id}
              />
              <RecaptchaNotice />
            </>
          )}
          <Honeypot register={register} />

          <div className="flex flex-wrap items-center justify-between gap-5">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="inline-flex items-center gap-2 text-lg font-medium hover:underline"
              >
                <span aria-hidden className="inline-block rtl:-scale-x-100">
                  ←
                </span>
                {copy.back}
              </button>
            ) : (
              <span aria-hidden />
            )}
            <div className="flex items-center gap-5">
              {step === 1 && (
                <span className="text-sm" aria-live="polite">
                  {boothCount === 0
                    ? copy.noneSelected
                    : fillTemplate(copy.selectedCount, {count: boothCount})}
                </span>
              )}
              {step === LAST_STEP ? (
                <SubmitButton
                  disabled={isSubmitting}
                  isSubmitting={isSubmitting}
                  label={copy.submit}
                  submittingLabel={t['form.label.submitting']}
                  lang={lang}
                />
              ) : (
                <Button type="submit">
                  {copy.next} <ArrowIcon lang={lang} />
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

type StepProps = {
  copy: QuoteCopy
  register: UseFormRegister<QuoteValues>
  errors: Errors
  id: string
}

const StepHeading = ({title, hint}: {title: string; hint?: string}) => (
  <div className="space-y-2">
    <h3 className="text-2xl font-semibold">{title}</h3>
    {hint ? <p>{hint}</p> : null}
  </div>
)

/** Selected state and keyboard focus are drawn on the label; the native input stays in the tab order. */
const choiceClass = cn(
  'cursor-pointer border-2 border-black dark:border-white transition-colors',
  'hover:bg-black/10 dark:hover:bg-white/10',
  'has-[:checked]:bg-black has-[:checked]:text-white dark:has-[:checked]:bg-white dark:has-[:checked]:text-black',
  'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-black dark:has-[:focus-visible]:outline-white',
)

/** Single choice shown as chips: a fieldset of native radios, so arrow keys move between options. */
function ChoiceGroup({
  name,
  legend,
  options,
  register,
  error,
  id,
}: {
  name: 'eventType' | 'city' | 'contactMethod'
  legend: string
  options: FormOption[]
  register: UseFormRegister<QuoteValues>
  error?: string
  id: string
}) {
  const errId = `${id}-${name}-error`
  return (
    <fieldset className="space-y-4" aria-describedby={error ? errId : undefined}>
      <legend className="mb-4 text-2xl font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-3">
        {options.map((o) => (
          <label key={o.value} className={cn(choiceClass, 'px-5 py-2 text-lg')}>
            <input type="radio" value={o.value} className="sr-only" {...register(name)} />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError id={errId} message={error} />
    </fieldset>
  )
}

function TextInput({
  name,
  label,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  register,
  errors,
  id,
}: {
  name: 'date' | 'guests' | 'notes' | 'fullName' | 'company' | 'email' | 'phone'
  label: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea'
  required?: boolean
  autoComplete?: string
  placeholder?: string
  register: UseFormRegister<QuoteValues>
  errors: Errors
  id: string
}) {
  const fieldId = `${id}-${name}`
  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input
        f={{name, type, required, autoComplete}}
        id={fieldId}
        errId={`${fieldId}-error`}
        register={register}
        errors={errors}
        placeholder={placeholder}
      />
      <FieldError id={`${fieldId}-error`} message={errors[name]?.message} />
    </Field>
  )
}

function StepBasics({copy, register, errors, id}: StepProps) {
  return (
    <div className="space-y-10">
      <ChoiceGroup
        name="eventType"
        legend={copy.eventTypeQuestion}
        options={copy.eventTypes}
        register={register}
        error={errors.eventType?.message}
        id={id}
      />
      <ChoiceGroup
        name="city"
        legend={copy.cityQuestion}
        options={copy.cities}
        register={register}
        error={errors.city?.message}
        id={id}
      />
      <div className="grid sm:grid-cols-2 gap-10">
        <TextInput
          name="date"
          type="date"
          required
          label={copy.dateLabel}
          register={register}
          errors={errors}
          id={id}
        />
        <TextInput
          name="guests"
          type="number"
          label={copy.guestsLabel}
          placeholder={copy.guestsPlaceholder}
          register={register}
          errors={errors}
          id={id}
        />
      </div>
    </div>
  )
}

function StepBooths({copy, register, id}: StepProps) {
  return (
    <fieldset className="space-y-6" aria-describedby={`${id}-booths-hint`}>
      <legend className="mb-2 text-2xl font-semibold">{copy.boothsQuestion}</legend>
      <p id={`${id}-booths-hint`}>{copy.boothsHint}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {copy.booths.map((b) => (
          <label
            key={b.value}
            className={cn(
              choiceClass,
              'group flex items-start justify-between gap-3 p-4 text-start',
            )}
          >
            <input type="checkbox" value={b.value} className="sr-only" {...register('booths')} />
            <span className="space-y-1">
              <span className="block text-lg font-semibold">{b.label}</span>
              {b.note ? <span className="block text-sm">{b.note}</span> : null}
            </span>
            <span
              aria-hidden
              className={cn(
                'mt-1 flex h-5 w-5 shrink-0 items-center justify-center border-2 text-xs',
                'border-black dark:border-white group-has-[:checked]:border-white dark:group-has-[:checked]:border-black',
                'after:content-[""] group-has-[:checked]:after:content-["✓"]',
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function StepExtras({copy, register, errors, id}: StepProps) {
  return (
    <div className="space-y-6">
      <fieldset className="space-y-6" aria-describedby={`${id}-extras-hint`}>
        <legend className="mb-2 text-2xl font-semibold">{copy.extrasQuestion}</legend>
        <p id={`${id}-extras-hint`}>{copy.extrasHint}</p>
        <div>
          {copy.extras.map((x) => (
            <label
              key={x.value}
              className="group flex w-full cursor-pointer items-center justify-between gap-5 border-t border-black/30 py-4 text-start dark:border-white/30 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
            >
              <input type="checkbox" value={x.value} className="sr-only" {...register('extras')} />
              <span className="space-y-1">
                <span className="block text-lg font-medium">{x.label}</span>
                {x.note ? <span className="block text-sm">{x.note}</span> : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  'flex h-6.5 w-11 shrink-0 items-center justify-start border-2 border-black p-0.5 transition-colors dark:border-white',
                  'group-has-[:checked]:justify-end group-has-[:checked]:bg-black dark:group-has-[:checked]:bg-white',
                )}
              >
                <span className="h-4 w-4 bg-black dark:bg-white group-has-[:checked]:bg-white dark:group-has-[:checked]:bg-black" />
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <TextInput
        name="notes"
        type="textarea"
        label={copy.notesLabel}
        placeholder={copy.notesPlaceholder}
        register={register}
        errors={errors}
        id={id}
      />
    </div>
  )
}

function StepDetails({copy, register, errors, id}: StepProps) {
  return (
    <div className="space-y-10">
      <StepHeading title={copy.detailsQuestion} hint={copy.detailsHint} />
      <div className="grid sm:grid-cols-2 gap-10">
        <TextInput
          name="fullName"
          required
          autoComplete="name"
          label={copy.fullName}
          register={register}
          errors={errors}
          id={id}
        />
        <TextInput
          name="company"
          autoComplete="organization"
          label={copy.company}
          register={register}
          errors={errors}
          id={id}
        />
        <TextInput
          name="email"
          type="email"
          required
          autoComplete="email"
          label={copy.email}
          register={register}
          errors={errors}
          id={id}
        />
        <TextInput
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          label={copy.phone}
          placeholder={copy.phonePlaceholder}
          register={register}
          errors={errors}
          id={id}
        />
      </div>
      <ChoiceGroup
        name="contactMethod"
        legend={copy.contactMethodLabel}
        options={copy.contactMethods}
        register={register}
        error={errors.contactMethod?.message}
        id={id}
      />
    </div>
  )
}
