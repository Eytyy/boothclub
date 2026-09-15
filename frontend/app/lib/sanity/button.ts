import type {DereferencedLink} from '@/sanity/lib/types'

/**
 * Shape of any Sanity `button` object after GROQ has dereferenced its `link`.
 *
 * Sanity typegen types `button.link` against the raw schema (e.g. `page` as a
 * `PageReference`), but at runtime our queries always project `link` with the
 * shared `linkFields` fragment, producing a `DereferencedLink`. This type
 * describes that projected shape so call sites don't have to cast.
 */
export type SanityButtonLike =
  | {
      buttonText?: string | null
      link?: unknown
    }
  | null
  | undefined

/**
 * Narrow a Sanity button's `link` to the dereferenced shape used across the UI.
 *
 * Returns `undefined` when the button is missing or has no link so callers can
 * early-return without juggling nullable casts.
 */
export function resolveButtonLink(button: SanityButtonLike): DereferencedLink | undefined {
  const link = button?.link
  if (!link) return undefined
  return link as DereferencedLink
}

/** Returns `true` when a Sanity button has both a label and a dereferenceable link. */
export function hasSanityCta(button: SanityButtonLike): boolean {
  return Boolean(button?.buttonText && resolveButtonLink(button))
}
