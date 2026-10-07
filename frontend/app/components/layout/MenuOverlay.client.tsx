'use client'

import {useState} from 'react'
import {AnimatePresence, motion, type Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'

import NavMenuItem from './NavMenuItem'
import NavMenuItemGroup from './NavMenuItemGroup.client'
import type {SiteMenuGroup, SiteMenuItem} from '@/sanity/lib/types'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'

interface MenuOverlayProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
  onNavigate: () => void
}

const staggerOut = {when: 'afterChildren', staggerChildren: 0.04, staggerDirection: -1} as const
const staggerIn = {when: 'beforeChildren', staggerChildren: 0.06, delayChildren: 0.08} as const

/** Over the content the panel slides in from the right, so it reads as the grid's edge moving in. */
const slideVariants: Variants = {
  hidden: {
    x: '100%',
    transition: {...staggerOut, duration: 0.35, ease: [0.4, 0, 1, 1]},
  },
  visible: {
    x: 0,
    transition: {...staggerIn, duration: 0.45, ease: [0.22, 1, 0.36, 1]},
  },
}

/** Inside the right gutter there's no content edge to move, so the panel just fades in. */
const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: {...staggerOut, duration: 0.25, ease: 'easeIn'},
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {...staggerIn, duration: 0.25, ease: 'easeOut'},
  },
}

/**
 * Viewport width from which `menu-overlay-width` fits entirely in the right gutter:
 * (width - 1920) / 2 + 112 + 4 >= 425.
 */
const FITS_IN_GUTTER_QUERY = '(min-width: 2538px)'

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 0,
    transition: {duration: 0.2, ease: 'easeIn'},
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.35, ease: 'easeIn'},
  },
}

export default function MenuOverlay({items, onNavigate}: MenuOverlayProps) {
  const pathname = usePathname()
  const menuItems = items ?? []
  const fitsInGutter = useMediaQuery(FITS_IN_GUTTER_QUERY)

  return (
    <motion.div
      variants={fitsInGutter ? fadeVariants : slideVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed p-10 pt-(--header-height) space-y-10 right-0 top-0 h-svh z-40 w-full lg:menu-overlay-width lg:border-l-site border-black dark:border-white bg-white text-black dark:bg-black dark:text-white"
    >
      {menuItems.map((item) => (
        <motion.div className=" border-black" key={item._key} variants={itemVariants}>
          {item._type === 'menuItem' ? (
            <NavMenuItem item={item} pathname={pathname} onNavigate={onNavigate} />
          ) : (
            <NavMenuItemGroup group={item} pathname={pathname} onNavigate={onNavigate} />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}
