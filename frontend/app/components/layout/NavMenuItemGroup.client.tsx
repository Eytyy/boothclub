'use client'

import {AnimatePresence, motion} from 'framer-motion'

import {cn} from '@/app/lib/utils'
import type {SiteMenuGroup} from '@/sanity/lib/types'
import NavMenuItem from './NavMenuItem'

interface NavMenuItemGroupProps {
  group: SiteMenuGroup & {_key: string}
  pathname: string
  onNavigate: () => void
  isActive: boolean
  onToggle: (key: string) => void
}

export default function NavMenuItemGroup({
  group,
  pathname,
  onNavigate,
  isActive,
  onToggle,
}: NavMenuItemGroupProps) {
  const title = group.title?.trim()
  if (!title) return null

  const buttonId = `menu-group-${group._key}`
  const panelId = `menu-group-panel-${group._key}`

  return (
    <li className="flex flex-col">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isActive}
        aria-controls={panelId}
        onClick={() => onToggle(group._key)}
        className={cn(
          'group/menu-group flex items-center gap-3 md:gap-4 text-left',
          'text-2xl md:text-3xl lg:text-5xl font-semibold leading-[1.1]',
          'transition-colors',
          isActive && 'md:underline md:underline-offset-4',
        )}
      >
        <span>{title}</span>
        <ExpandIcon isActive={isActive} />
      </button>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="md:hidden overflow-hidden"
            initial={{height: 0, opacity: 0}}
            animate={{height: 'auto', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
          >
            <ul role="list" className="flex flex-col gap-3 pt-4 pb-2 pl-1">
              {group.items?.map((child) => (
                <NavMenuItem
                  key={child._key}
                  item={child}
                  pathname={pathname}
                  onNavigate={onNavigate}
                  className="text-lg md:text-xl xl:text-2xl"
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function ExpandIcon({isActive}: {isActive: boolean}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        'w-6 h-6 lg:w-8 lg:h-8 top-[2px] relative',
        'rounded-full border-2',
        'transition-transform duration-300',
        isActive && 'rotate-45',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
  )
}
