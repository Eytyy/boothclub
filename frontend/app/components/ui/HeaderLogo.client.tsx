'use client'

import {motion, type Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'
import type {MouseEvent} from 'react'

import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {logoPaths, logoViewBox} from '@/app/components/ui/logoPaths'
import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {useHeroLogoPast} from '@/app/hooks/useHeroLogoPast'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.08},
  },
}

const pathVariants: Variants = {
  hidden: {y: '100%', opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {duration: 0.45, ease: [0.22, 1, 0.36, 1]},
  },
}

interface HeaderLogoProps {
  forceVisible?: boolean
}

export default function HeaderLogo({forceVisible = false}: HeaderLogoProps = {}) {
  const pathname = usePathname()
  const lang = useLocale()
  const homeHref = localizedPath(lang, '/')
  const isHome = pathname === homeHref
  const past = useHeroLogoPast()

  const visible = forceVisible || past

  function handleLogoClick(e: MouseEvent<HTMLAnchorElement>) {
    if (!isHome) return
    e.preventDefault()
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <LocalizedLink href="/" className="block overflow-hidden h-8 " onClick={handleLogoClick}>
      <motion.svg
        viewBox={logoViewBox}
        fill="none"
        className="h-full w-auto"
        variants={containerVariants}
        initial="hidden"
        animate={visible ? 'visible' : 'hidden'}
      >
        {[...logoPaths].reverse().map((d, i) => (
          <motion.path key={i} d={d} fill="currentColor" variants={pathVariants} />
        ))}
      </motion.svg>
    </LocalizedLink>
  )
}
