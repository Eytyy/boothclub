import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import ContactForm, {type FormContext} from '@/app/components/forms/ContactForm.client'

type Props = {
  form: NonNullable<FormConfigByKeyQueryResult> | null | undefined
  context?: FormContext
  heading?: React.ReactNode
  className?: string
}

export default function ContactFormSection({form, context, heading, className}: Props) {
  if (!form || form.key !== 'contact-us') {
    return null
  }

  const privacyHref = form.privacyPageSlug ? `/${form.privacyPageSlug}` : '/'

  return (
    <section className={className}>
      {heading}
      {form.description ? (
        <p className="mb-6 text-lg leading-tight lg:max-w-[560px] lg:text-2xl">
          {form.description}
        </p>
      ) : null}
      <ContactForm
        formKey="contact-us"
        privacyHref={privacyHref}
        successText={form.successMessage ?? 'Thanks — your message has been sent.'}
        errorText={form.errorText ?? 'Something went wrong. Please try again later.'}
        consentText={form.consentText ?? undefined}
        notificationsLabel={form.notificationsLabel ?? undefined}
        personalDataNote={form.personalDataNote ?? undefined}
        context={context}
      />
    </section>
  )
}
