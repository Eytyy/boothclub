'use client'

import {createContext, useContext, type ReactNode} from 'react'

import {defaultLocale, type Locale} from './config'
import {getDictionary, type Dictionary} from './dictionary'

const LocaleContext = createContext<Locale>(defaultLocale)

export function LocaleProvider({value, children}: {value: Locale; children: ReactNode}) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useDictionary(): Dictionary {
  return getDictionary(useContext(LocaleContext))
}
