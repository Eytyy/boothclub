import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import ContactForm, {type FormContext} from '@/app/components/forms/ContactForm.client'
import {cn} from '@/app/lib/utils'
import TextReveal from '../ui/TextReveal.client'

type Props = {
  form: NonNullable<FormConfigByKeyQueryResult> | null | undefined
  context?: FormContext
  title: string
  className?: string
}

export default function ContactFormSection({form, context, title, className}: Props) {
  if (!form || form.key !== 'contact-us') {
    return null
  }

  const privacyHref = form.privacyPageSlug ? `/${form.privacyPageSlug}` : '/'

  return (
    <section className={cn('h-full', className)}>
      <TextReveal className="text-6xl leading-tight font-bold p-10" text={title} />
      <div className="flex-1">
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
      </div>
    </section>
  )
}
