import {localizedPath, type Locale} from '@/app/lib/i18n/config'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {HOME_CTA_VARIANT} from './config'
import ContactFormSection from './ContactFormSection'
import {resolveContactCopy} from './copy'
import QuoteFlowSection from './QuoteFlowSection'

/**
 * The form that closes the home page. Which one is set by `HOME_CTA_VARIANT`
 * (or the `variant` prop) while the client decides.
 */
export default async function HomeCta({
  lang,
  variant = HOME_CTA_VARIANT,
}: {
  lang: Locale
  variant?: 'quote' | 'contact'
}) {
  const context = {title: 'Home', url: localizedPath(lang, '/')}

  if (variant === 'contact') {
    const form = await fetchFormConfigByKey('contact-us', lang)
    if (!form) return null
    return (
      <section>
        <SectionHeading>{resolveContactCopy(lang, form).eyebrow}</SectionHeading>
        <ContactFormSection form={form} lang={lang} context={context} />
      </section>
    )
  }

  const form = await fetchFormConfigByKey('quote-request', lang)
  return <QuoteFlowSection form={form} lang={lang} context={context} />
}
