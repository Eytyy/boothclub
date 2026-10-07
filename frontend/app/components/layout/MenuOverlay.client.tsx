'use client'

import {useEffect, useState} from 'react'
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

const PANEL_MIN_WIDTH = 425
const BORDER_WIDTH = 4

interface Gutters {
  viewport: number
  /** Distance from the viewport's left edge to the page grid's left edge. */
  left: number
  /** Distance from the page grid's right edge to the viewport's right edge. */
  right: number
}

/**
 * Where the page grid (`data-page-grid`) sits in the viewport. Pages without one fall
 * back to the `container` + `mx-10` layout that `menu-overlay-width` also assumes.
 * The viewport width excludes the scrollbar, the same box `100%` resolves against on
 * the fixed panel.
 */
function measureGutters(): Gutters {
  const viewport = document.documentElement.clientWidth
  const rect = document.querySelector('[data-page-grid]')?.getBoundingClientRect()
  if (rect && rect.width > 0) {
    return {viewport, left: rect.left, right: viewport - rect.right}
  }
  const gutter =
    viewport < 1024 ? 20 : viewport < 1280 ? 60 : Math.max(0, (viewport - 1920) / 2) + 112
  return {viewport, left: gutter, right: gutter}
}

function useGutters() {
  const [gutters, setGutters] = useState(measureGutters)
  useEffect(() => {
    const update = () => setGutters(measureGutters())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return gutters
}

/**
 * The panel's width, and how far right it sits when closed so its left border lies on
 * the grid's right border. On lg+ the width matches `menu-overlay-width`; below lg the
 * panel opens all the way to the grid's left border.
 */
function panelGeometry({viewport, left, right}: Gutters, isLg: boolean) {
  const width = isLg ? Math.max(PANEL_MIN_WIDTH, right + BORDER_WIDTH) : viewport - left
  return {width, closedOffset: Math.max(0, width - right - BORDER_WIDTH)}
}

/**
 * Over the content the panel starts with its border on the grid's right border and
 * slides left from there, so it reads as the grid's edge being pulled in.
 */
const slideVariants: Variants = {
  hidden: (closedOffset: number) => ({
    x: closedOffset,
    transition: {...staggerOut, duration: 0.35, ease: [0.4, 0, 1, 1]},
  }),
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
  const isLg = useMediaQuery('(min-width: 1024px)')
  const {width, closedOffset} = panelGeometry(useGutters(), isLg)

  return (
    <motion.div
      variants={closedOffset === 0 ? fadeVariants : slideVariants}
      custom={closedOffset}
      style={isLg ? undefined : {width}}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed p-10 pt-(--header-height) space-y-10 right-0 top-0 h-svh z-40 lg:menu-overlay-width border-l-site border-black dark:border-white bg-white text-black dark:bg-black dark:text-white"
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
