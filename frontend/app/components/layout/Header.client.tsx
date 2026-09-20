'use client'

import {useCallback, useEffect, useState} from 'react'
import {AnimatePresence} from 'framer-motion'

import DarkModeToggle from '../ui/DarkModeToggle.client'
import MenuToggle from '../ui/MenuToggle.client'
import HeaderLogo from '../ui/HeaderLogo.client'
import MenuOverlay from './MenuOverlay.client'
import {useFooterOverlap} from '@/app/hooks/useFooterOverlap'
import {useHeroLogoPast} from '@/app/hooks/useHeroLogoPast'
import {cn} from '@/app/lib/utils'
import type {SiteMenuItem} from '@/sanity/lib/types'

interface HeaderClientProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
}

export default function HeaderClient({items, ctaLabel}: HeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const onBrandFooter = useFooterOverlap()
  const showBackdrop = useHeroLogoPast() && !onBrandFooter

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
          'fixed z-50 top-0 py-5 lg:py-10 px-5 lg:px-10 right-0 flex items-center gap-2 bottom-0',
          'flex flex-col items-center gap-6 transition-colors justify-between',
          onBrandFooter && 'text-black',
        )}
      >
        <MenuToggle isOpen={menuOpen} onClick={() => setMenuOpen((prev) => !prev)} />
        <div className="flex flex-col items-center gap-5">
          <LanguageToggle />
        </div>
      </div>
      <div
        className={cn(
          'fixed z-50 bottom-0 py-5 lg:py-10 px-5 lg:px-10 left-0 flex items-center gap-2',
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

function LanguageToggle() {
  return <div className="font-bold text-lg">AR</div>
}
