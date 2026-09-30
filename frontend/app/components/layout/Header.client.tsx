'use client'

import {Suspense, useCallback, useEffect, useState} from 'react'
import {AnimatePresence} from 'framer-motion'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'

import DarkModeToggle from '../ui/DarkModeToggle.client'
import MenuToggle from '../ui/MenuToggle.client'
import HeaderLogo from '../ui/HeaderLogo.client'
import MenuOverlay from './MenuOverlay.client'
import {useFooterOverlap} from '@/app/hooks/useFooterOverlap'
import {localizedPath, stripLocale, type Locale} from '@/app/lib/i18n/config'
import {useDictionary, useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'
import type {SiteMenuItem} from '@/sanity/lib/types'

interface HeaderClientProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
}

export default function HeaderClient({items, ctaLabel}: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const onBrandFooter = useFooterOverlap()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    window.addEventListener('popstate', closeMenu)
    return () => window.removeEventListener('popstate', closeMenu)
  }, [closeMenu])

  return (
    <>
      <div
        className={cn(
          'fixed z-50 top-10 px-5 lg:px-10 transition-colors ',
          onBrandFooter && 'text-black',
        )}
      >
        <HeaderLogo forceVisible={true} />
      </div>
      <div
        className={cn(
          'fixed z-50 top-0 py-5 lg:py-10 px-5 lg:px-10 ltr:right-0 rtl:left-0 flex items-center gap-2 bottom-0',
          'flex flex-col items-center gap-6 transition-colors justify-between',
          onBrandFooter && 'text-black',
        )}
      >
        <MenuToggle isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
        <div className="flex flex-col items-center gap-5">
          <LanguageToggle onNavigate={closeMenu} />
        </div>
      </div>
      <div
        className={cn(
          'fixed z-50 bottom-0 py-5 lg:py-10 px-5 lg:px-10 ltr:left-0 rtl:right-0 flex items-center gap-2',
          'flex flex-col items-center gap-6 transition-colors justify-between',
          onBrandFooter && 'text-black',
        )}
      >
        <DarkModeToggle />
      </div>
      <AnimatePresence>
        {menuOpen && <MenuOverlay ctaLabel={ctaLabel} items={items} onNavigate={closeMenu} />}
      </AnimatePresence>
    </>
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
      className="font-bold text-lg"
    >
      {LOCALE_LABEL[target]}
    </Link>
  )
}
