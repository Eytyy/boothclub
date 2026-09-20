'use client'

import {useState} from 'react'
import {AnimatePresence, motion, type Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'

import NavMenuItem from './NavMenuItem'
import NavMenuItemGroup from './NavMenuItemGroup.client'
import type {SiteMenuGroup, SiteMenuItem} from '@/sanity/lib/types'

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
    y: 16,
    transition: {duration: 0.2, ease: 'easeIn'},
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.35, ease: [0.22, 1, 0.36, 1]},
  },
}

export default function MenuOverlay({items, onNavigate}: MenuOverlayProps) {
  const pathname = usePathname()
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const menuItems = items ?? []

  const handleToggle = (key: string) => {
    setActiveKey((current) => (current === key ? null : key))
  }

  const activeGroup = menuItems.find(
    (item): item is SiteMenuGroup & {_key: string} =>
      item._type === 'menuItemGroup' && item._key === activeKey,
  )

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-40"
    >
      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16 overflow-y-auto  w-full">
        <div className="container">
          <div className="bg-black text-white p-10 w-full">
            <ul role="list" className="flex flex-col gap-4 md:gap-5 md:basis-1/2 ">
              {menuItems.map((item) => (
                <motion.div key={item._key} variants={itemVariants}>
                  {item._type === 'menuItem' ? (
                    <NavMenuItem item={item} pathname={pathname} onNavigate={onNavigate} />
                  ) : (
                    <NavMenuItemGroup
                      group={item}
                      pathname={pathname}
                      onNavigate={onNavigate}
                      isActive={activeKey === item._key}
                      onToggle={handleToggle}
                    />
                  )}
                </motion.div>
              ))}
            </ul>

            <div className="hidden md:flex md:flex-1 md:items-start md:pt-2">
              <AnimatePresence mode="wait">
                {activeGroup && (
                  <motion.ul
                    key={activeGroup._key}
                    role="list"
                    className="flex flex-col gap-4"
                    initial={{opacity: 0, y: 12}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 12}}
                    transition={{duration: 0.25, ease: [0.22, 1, 0.36, 1]}}
                  >
                    {activeGroup.items?.map((child) => (
                      <NavMenuItem
                        key={child._key}
                        item={child}
                        pathname={pathname}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
