'use client'

import {Suspense, useCallback, useEffect, useState} from 'react'
import {AnimatePresence} from 'framer-motion'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'

import DarkModeToggle from '../ui/DarkModeToggle.client'
import MenuToggle from '../ui/MenuToggle.client'
import HeaderLogo from '../ui/HeaderLogo.client'
import MenuOverlay from './MenuOverlay.client'
import {localizedPath, stripLocale, type Locale} from '@/app/lib/i18n/config'
import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import type {SiteMenuItem} from '@/sanity/lib/types'

interface HeaderClientProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
}

export default function HeaderClient({items, ctaLabel}: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    window.addEventListener('popstate', closeMenu)
    return () => window.removeEventListener('popstate', closeMenu)
  }, [closeMenu])

  return (
    <header className="container sticky top-0 z-100">
      <div className="mx-6 lg:mx-10 bg-white dark:bg-black text-black dark:text-white border-x-site">
        <div className="flex items-center justify-between lg:px-10 py-5 border-b-site ">
          <HeaderLogo forceVisible={true} />
          <div className="flex items-center gap-5 md:bottom-0 justify-between">
            <DarkModeToggle />
            <LanguageToggle onNavigate={closeMenu} />
            <MenuToggle isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && <MenuOverlay ctaLabel={ctaLabel} items={items} onNavigate={closeMenu} />}
        </AnimatePresence>
      </div>
    </header>
  )
}

const LOCALE_LABEL: Record<Locale, string> = {
  en: 'EN',
  ar: 'AR',
}

function otherLocale(lang: Locale): Locale {
  return lang === 'ar' ? 'en' : 'ar'
}

function LanguageToggle({onNavigate}: {onNavigate: () => void}) {
  const pathname = usePathname()
  const target = otherLocale(useLocale())
  const href = localizedPath(target, stripLocale(pathname))

  return (
    <Suspense fallback={<LanguageSwitchLink href={href} target={target} onNavigate={onNavigate} />}>
      <LanguageSwitchSearchLink href={href} target={target} onNavigate={onNavigate} />
    </Suspense>
  )
}

function LanguageSwitchSearchLink({
  href,
  target,
  onNavigate,
}: {
  href: string
  target: Locale
  onNavigate: () => void
}) {
  const searchParams = useSearchParams()
  const qs = searchParams.toString()

  return (
    <LanguageSwitchLink
      href={qs ? `${href}?${qs}` : href}
      target={target}
      onNavigate={onNavigate}
    />
  )
}

function LanguageSwitchLink({
  href,
  target,
  onNavigate,
}: {
  href: string
  target: Locale
  onNavigate: () => void
}) {
  const t = useDictionary()
  const label = target === 'ar' ? t['language.switchToArabic'] : t['language.switchToEnglish']

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      dir="ltr"
      aria-label={label}
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return
        }
        onNavigate()
      }}
      className="font-semibold text-sm border-2 rounded-full w-8 h-8 flex items-center justify-center"
    >
      {LOCALE_LABEL[target]}
    </Link>
  )
}
