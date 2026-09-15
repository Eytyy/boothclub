import type {Metadata} from 'next'

import {locales, localizedPath, type Locale} from '@/app/lib/i18n/config'

export function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(locales.map((locale) => [locale, localizedPath(locale, path)]))
}

export function localeAlternates(lang: Locale, path: string): NonNullable<Metadata['alternates']> {
  return {
    canonical: localizedPath(lang, path),
    languages: languageAlternates(path),
  }
}

export function sitemapLanguageAlternates(baseUrl: string, path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}${localizedPath(locale, path)}`]),
  )
}
