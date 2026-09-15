'use client'

import Link from 'next/link'
import type {ComponentProps} from 'react'

import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'

type LocalizedLinkProps = ComponentProps<typeof Link>

function localizeHref(lang: ReturnType<typeof useLocale>, href: LocalizedLinkProps['href']) {
  if (typeof href === 'string') {
    return localizedPath(lang, href)
  }
  if (href.pathname) {
    return {...href, pathname: localizedPath(lang, href.pathname)}
  }
  return href
}

/** next/link wrapper that prefixes internal paths for the active locale. */
export default function LocalizedLink({href, ...props}: LocalizedLinkProps) {
  const lang = useLocale()
  return <Link href={localizeHref(lang, href)} {...props} />
}
