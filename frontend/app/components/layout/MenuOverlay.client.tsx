'use client'

import {useState} from 'react'
import {AnimatePresence, motion, type Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'

import NavMenuItem from './NavMenuItem'
import NavMenuItemGroup from './NavMenuItemGroup.client'
import type {SiteMenuGroup, SiteMenuItem} from '@/sanity/lib/types'
import {GridContainer, GridBlock} from '@/app/components/ui/GridSystem'

interface MenuOverlayProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
  onNavigate: () => void
}

const overlayVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.04,
      staggerDirection: -1,
      duration: 0.25,
      ease: 'easeIn',
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.06,
      delayChildren: 0.08,
      duration: 0.25,
      ease: 'easeOut',
    },
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

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="border-b-site px-10 py-5"
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
