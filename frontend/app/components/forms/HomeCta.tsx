import {localizedPath, type Locale} from '@/app/lib/i18n/config'
import TextReveal from '@/app/components/ui/TextReveal.client'
import {fetchFormConfigByKey} from '@/sanity/lib/data'
import {HOME_CTA_VARIANT} from './config'
import ContactForm from './ContactForm.client'
import {resolveContactCopy, resolveFormSettings} from './copy'
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
    const copy = resolveContactCopy(lang, form)
    // Same split as the quote section it replaces: heading on one side, fields on the other.
    return (
      <section className="grid lg:grid-cols-2" aria-labelledby="home-cta-title">
        <div className="p-5 lg:p-10 space-y-5">
          <h2 id="home-cta-title" className="text-sm font-semibold uppercase tracking-wide">
            {copy.eyebrow}
          </h2>
          <TextReveal className="text-reveal-default" text={copy.heading} />
        </div>
        <div className="border-t-site lg:border-t-0 lg:border-s-site border-black dark:border-white">
          <ContactForm copy={copy} settings={resolveFormSettings(form)} context={context} />
        </div>
      </section>
    )
  }

  const form = await fetchFormConfigByKey('quote-request', lang)
  return <QuoteFlowSection form={form} lang={lang} context={context} />
}
