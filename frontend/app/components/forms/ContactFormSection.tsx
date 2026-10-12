import {stegaClean} from '@sanity/client/stega'

import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import ContactForm, {type FormContext} from '@/app/components/forms/ContactForm.client'
import type {Locale} from '@/app/lib/i18n/config'
import {cn} from '@/app/lib/utils'
import TextReveal from '../ui/TextReveal.client'
import {GridBlock} from '../ui/GridSystem'
import {fillTemplate, resolveContactCopy, resolveFormSettings} from './copy'

type Props = {
  form: FormConfigByKeyQueryResult | null | undefined
  lang: Locale
  context?: FormContext
  /** Product name to prefill the message with. */
  product?: string
  className?: string
}

export default function ContactFormSection({form, lang, context, product, className}: Props) {
  if (!form || form.key !== 'contact-us') {
    return null
  }

  const copy = resolveContactCopy(lang, form)
  // Page titles can carry visual-editing markers; they must not leak into the message.
  const productName = product ? stegaClean(product).trim() : ''

  return (
    <section className={cn('h-full', className)}>
      <GridBlock as={TextReveal} text={copy.heading} />
      <ContactForm
        copy={copy}
        settings={resolveFormSettings(form)}
        context={context}
        defaultMessage={
          productName ? fillTemplate(copy.productPrefill, {product: productName}) : undefined
        }
      />
    </section>
  )
}
