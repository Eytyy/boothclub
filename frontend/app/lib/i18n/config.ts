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

function localeSegment(pathname: string): Locale | undefined {
  const segment = pathname.split('/')[1]
  return segment && isLocale(segment) ? segment : undefined
}

/** Locale encoded in the path. Unprefixed URLs are English, matching the proxy rewrite. */
export function localeFromPathname(pathname: string): Locale {
  return localeSegment(pathname) ?? defaultLocale
}

/** Drop a leading `/en` or `/ar` so the remainder can be prefixed for another locale. */
export function stripLocale(pathname: string): string {
  if (!localeSegment(pathname)) return pathname || '/'
  const rest = pathname.split('/').slice(2).join('/')
  return rest ? `/${rest}` : '/'
}
