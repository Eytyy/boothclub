export const locales = ['en', 'ar'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** Prefix `path` with `/ar` for Arabic; leave English unprefixed. */
export function localizedPath(lang: Locale, path: string): string {
  // Protocol-relative URLs (`//cdn.example.com`) also start with `/`.
  if (!path.startsWith('/') || path.startsWith('//') || lang === defaultLocale) {
    return path
  }
  if (path === '/') {
    return `/${lang}`
  }
  return `/${lang}${path}`
}
