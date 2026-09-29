'use client'

import {createContext, useContext, useLayoutEffect, type ReactNode} from 'react'
import {usePathname} from 'next/navigation'

import {defaultLocale, localeFromPathname, type Locale} from './config'
import {getDictionary, type Dictionary} from './dictionary'

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({value, children}: {value: Locale; children: ReactNode}) {
  const pathname = usePathname()
  // The URL is the source of truth so a client navigation between locales updates
  // context even when the root layout does not re-render. `value` covers a render
  // before a pathname is available.
  const lang = pathname ? localeFromPathname(pathname) : value

  useLayoutEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  return <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useDictionary(): Dictionary {
  return getDictionary(useContext(LocaleContext))
}
