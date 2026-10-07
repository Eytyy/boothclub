'use client'

import {useState, useSyncExternalStore} from 'react'
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

/*
 * Mirrors `menu-overlay-width` in globals.css. On lg+ the page grid's right edge sits
 * `gridGutter` px from the viewport edge: the container's 20px padding plus the grid's
 * 40px margin, or from xl half of what's past the 1920px max-width plus 72px + 40px.
 */
const PANEL_MIN_WIDTH = 425
const BORDER_WIDTH = 4

function gridGutter(viewportWidth: number) {
  if (viewportWidth < 1280) return 60
  return Math.max(0, (viewportWidth - 1920) / 2) + 112
}

/**
 * How far the open panel's left border is from the grid's right border. Closed, the
 * panel is shifted right by this much so its border sits on the grid's; 0 means the
 * panel fits entirely in the gutter.
 */
function closedOffset(viewportWidth: number) {
  return Math.max(0, PANEL_MIN_WIDTH - BORDER_WIDTH - gridGutter(viewportWidth))
}

function subscribeResize(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

/** Viewport width without the scrollbar, the same box `100%` resolves against on the fixed panel. */
function useViewportWidth() {
  return useSyncExternalStore(
    subscribeResize,
    () => document.documentElement.clientWidth,
    () => 0,
  )
}

/**
 * Over the content the panel starts with its border on the grid's right border and
 * slides left from there, so it reads as the grid's edge being pulled in. Below lg it
 * has no border and covers the screen, so it slides in from off-screen.
 */
const slideVariants: Variants = {
  hidden: (offset: number | null) => ({
    x: offset ?? '100%',
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
  const viewportWidth = useViewportWidth()
  const offset = isLg ? closedOffset(viewportWidth) : null

  return (
    <motion.div
      variants={offset === 0 ? fadeVariants : slideVariants}
      custom={offset}
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
