'use client'

import {usePathname} from 'next/navigation'
import {useSyncExternalStore} from 'react'

import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {useHeroState} from '@/app/context/HeroStateContext.client'

/**
 * Returns `true` once the home hero logo has scrolled out of view.
 * On non-home routes this is always `true`. On the home path it requires the
 * intro animation to have completed and the hero scroll progress to
 * have crossed ~0.95 (i.e. the big logo has effectively left the top).
 *
 * Shared by `HeaderLogo.client.tsx` (when to fade in the small logo)
 * and `Header.client.tsx` (when to show the mobile backdrop), so both
 * surfaces reveal in lockstep.
 */
export function useHeroLogoPast(): boolean {
  const pathname = usePathname()
  const lang = useLocale()
  const isHome = pathname === localizedPath(lang, '/')
  const {introScrollProgress, introComplete} = useHeroState()

  const progress = useSyncExternalStore(
    (cb) => introScrollProgress.on('change', cb),
    () => introScrollProgress.get(),
    () => 0,
  )

  return !isHome || (introComplete && progress >= 0.95)
}
