import type {ReactNode} from 'react'

import type {FormConfigByKeyQueryResult} from '@/sanity.types'
import type {Locale} from '@/app/lib/i18n/config'
import {cn} from '@/app/lib/utils'
import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import SectionHeading from '@/app/components/ui/SectionHeading'
import ContactFormSection from './ContactFormSection'
import {resolveContactCopy} from './copy'
import type {FormContext} from './useFormSubmit'

type Props = {
  form: FormConfigByKeyQueryResult | null | undefined
  lang: Locale
  context?: FormContext
  /** Product name to prefill the message with (product pages). */
  product?: string
  /** The right-hand column: other products, other projects, recent posts. */
  aside?: ReactNode
  asideHeading?: ReactNode
  className?: string
  /** Extra classes for the sticky form column (offset, background). */
  formColumnClassName?: string
}

/**
 * The short "Get an Instant Quote" form that closes the inner pages, with a related
 * list beside it. /contact has the full quote flow instead and does not use this.
 */
export default function QuoteCtaSection({
  form,
  lang,
  context,
  product,
  aside,
  asideHeading,
  className,
  formColumnClassName = 'top-0',
}: Props) {
  if (!form) return null
  const copy = resolveContactCopy(lang, form)

  return (
    <GridContainer
      columns={[8, 4]}
      className={cn('max-lg:grid-cols-1 max-lg:[&_.grid-divider]:hidden', className)}
    >
      <GridColumn
        span={8}
        className={cn('min-w-0 max-lg:contents sticky self-start', formColumnClassName)}
      >
        <SectionHeading>{copy.eyebrow}</SectionHeading>
        <ContactFormSection
          className="max-lg:order-4 h-full flex-col flex"
          form={form}
          lang={lang}
          context={context}
          product={product}
        />
      </GridColumn>
      <GridColumn span={4} className="max-lg:contents">
        {asideHeading ? <SectionHeading>{asideHeading}</SectionHeading> : null}
        {aside}
      </GridColumn>
    </GridContainer>
  )
}
