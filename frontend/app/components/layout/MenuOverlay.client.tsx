'use client'

import {useState} from 'react'
import {AnimatePresence, motion, type Variants} from 'framer-motion'
import {usePathname} from 'next/navigation'

import NavMenuItem from './NavMenuItem'
import NavMenuItemGroup, {NavMenuGroupItems} from './NavMenuItemGroup.client'
import RowSlider from '@/app/components/ui/RowSlider.client'
import {cn} from '@/app/lib/utils'
import type {SiteMenuGroup, SiteMenuItem} from '@/sanity/lib/types'

interface MenuOverlayProps {
  items: SiteMenuItem[] | undefined
  ctaLabel?: string | null
  onNavigate: () => void
}

const overlayVariants: Variants = {
  hidden: {
    height: 0,
    transition: {
      when: 'afterChildren',
      staggerChildren: 0.03,
      staggerDirection: -1,
      duration: 0.25,
      ease: 'easeIn',
    },
  },
  visible: {
    height: 'auto',
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.05,
      duration: 0.25,
      ease: 'easeOut',
    },
  },
}

const itemVariants: Variants = {
  hidden: {opacity: 0, transition: {duration: 0.15, ease: 'easeIn'}},
  visible: {opacity: 1, transition: {duration: 0.3, ease: 'easeOut'}},
}

const subRowTransition = {duration: 0.3, ease: [0.22, 1, 0.36, 1]} as const

/**
 * Top-level links sit in one ruled row (stacked below `lg`). A group is a toggle:
 * opening it inverts its cell and drops its links into a second ruled row underneath.
 * From `lg` both rows slide sideways when their items don't fit.
 */
export default function MenuOverlay({items, onNavigate}: MenuOverlayProps) {
  const pathname = usePathname()
  const menuItems = items ?? []
  const [openGroupKey, setOpenGroupKey] = useState<string | null>(null)

  const openGroup = menuItems.find(
    (item): item is SiteMenuGroup & {_key: string} =>
      item._type === 'menuItemGroup' && item._key === openGroupKey,
  )

  return (
    <motion.nav
      aria-label="Main"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="overflow-hidden"
    >
      <RowSlider className="border-b-site">
        <ul role="list" className="flex flex-col lg:flex-row">
          {menuItems.map((item) => (
            <motion.li
              key={item._key}
              variants={itemVariants}
              className={cn(
                'border-b-site last:border-b-0 lg:border-b-0 lg:border-e-site lg:last:border-e-0 border-black dark:border-white',
                // Leaves share the row equally; a group keeps its natural width, as in the design.
                item._type === 'menuItem' ? 'lg:flex-1' : 'lg:flex-none',
              )}
            >
              {item._type === 'menuItem' ? (
                <NavMenuItem
                  item={item}
                  pathname={pathname}
                  onNavigate={onNavigate}
                  className="px-5 py-3 lg:px-10 lg:py-5 lg:text-center leading-normal lg:leading-normal hover:no-underline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
                />
              ) : (
                <>
                  <NavMenuItemGroup
                    group={item}
                    isOpen={openGroupKey === item._key}
                    onToggle={() =>
                      setOpenGroupKey((current) => (current === item._key ? null : item._key))
                    }
                  />
                  {/* Below `lg` the group's links unfold in place under its toggle. */}
                  <AnimatePresence initial={false}>
                    {openGroupKey === item._key && (
                      <motion.div
                        key="inline"
                        className="overflow-hidden lg:hidden"
                        initial={{height: 0}}
                        animate={{height: 'auto'}}
                        exit={{height: 0}}
                        transition={subRowTransition}
                      >
                        <NavMenuGroupItems
                          group={item}
                          pathname={pathname}
                          onNavigate={onNavigate}
                          className="border-t-site"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      </RowSlider>

      {/* From `lg` the open group's links get their own row under the main one. */}
      <AnimatePresence initial={false} mode="wait">
        {openGroup && (
          <motion.div
            key={openGroup._key}
            className="hidden lg:block overflow-hidden"
            initial={{height: 0}}
            animate={{height: 'auto'}}
            exit={{height: 0}}
            transition={subRowTransition}
          >
            <RowSlider className="border-b-site">
              <NavMenuGroupItems group={openGroup} pathname={pathname} onNavigate={onNavigate} />
            </RowSlider>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
