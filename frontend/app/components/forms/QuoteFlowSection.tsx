import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import type {Locale} from '@/app/lib/i18n/config'
import QuoteFlow from './QuoteFlow.client'
import {resolveFormSettings, resolveQuoteCopy} from './copy'
import type {FormContext} from './useFormSubmit'

/** The multi-step quote form with its wording resolved from the Quote Request form document. */
export default function QuoteFlowSection({
  form,
  lang,
  context,
  className,
}: {
  form: FormConfigByKeyQueryResult | null | undefined
  lang: Locale
  context?: FormContext
  className?: string
}) {
  return (
    <QuoteFlow
      copy={resolveQuoteCopy(lang, form)}
      settings={resolveFormSettings(form)}
      context={context}
      className={className}
    />
  )
}
