export const DEFAULT_LANGUAGE = 'en'

export const languages = [
  {id: 'en', title: 'English'},
  {id: 'ar', title: 'Arabic'},
]

type InternationalizedArrayItem = {
  _key?: string
  language?: string
  value?: unknown
}

type PortableTextSpan = {text?: string}
type PortableTextBlock = {
  _type?: string
  children?: PortableTextSpan[]
}

function itemLanguage(item: InternationalizedArrayItem): string | undefined {
  return item.language || item._key
}

function pickLocalizedItem(value: unknown): InternationalizedArrayItem | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined
  }

  const items = value as InternationalizedArrayItem[]
  return items.find((item) => itemLanguage(item) === DEFAULT_LANGUAGE) ?? items[0]
}

function firstSpanText(blocks: unknown): string {
  if (!Array.isArray(blocks)) {
    return ''
  }

  for (const block of blocks as PortableTextBlock[]) {
    if (block?._type && block._type !== 'block') {
      continue
    }
    if (!Array.isArray(block?.children)) {
      continue
    }

    const text = block.children
      .map((child) => child?.text)
      .filter((span): span is string => Boolean(span))
      .join('')

    if (text) {
      return text
    }
  }

  return ''
}

/** EN first, then the first array item — for previews and slug sources. */
export function localizedString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  const item = pickLocalizedItem(value)
  return typeof item?.value === 'string' ? item.value : ''
}

/** Same fallback order for Portable Text previews (first span text). */
export function localizedBlockText(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  const item = pickLocalizedItem(value)
  if (item && 'value' in item) {
    if (typeof item.value === 'string') {
      return item.value
    }
    return firstSpanText(item.value)
  }

  return firstSpanText(value)
}

/** Slug `source` helper: read a localized string/text field from the document. */
export function slugFromLocalized(doc: unknown, field = 'title'): string {
  if (!doc || typeof doc !== 'object') {
    return ''
  }
  return localizedString((doc as Record<string, unknown>)[field])
}
