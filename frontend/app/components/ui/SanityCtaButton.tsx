'use client'

import ArrowButton from './ArrowButton'
import {type ButtonVariant} from './Button'
import {resolveButtonLink, type SanityButtonLike} from '@/app/lib/sanity/button'

type SanityCtaButtonProps = {
  cta: SanityButtonLike
  variant?: ButtonVariant
  className?: string
}

/**
 * Renders a CTA `<ArrowButton>` from a Sanity `button` object, or `null` when the
 * button is empty/missing a link. Absorbs the `link` dereferencing cast so
 * individual blocks don't repeat it.
 */
export default function SanityCtaButton({cta, variant, className}: SanityCtaButtonProps) {
  const link = resolveButtonLink(cta)
  if (!link || !cta?.buttonText) return null
  return (
    <ArrowButton link={link} variant={variant} className={className}>
      {cta.buttonText}
    </ArrowButton>
  )
}
