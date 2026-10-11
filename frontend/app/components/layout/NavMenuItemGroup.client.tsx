'use client'

import {cn} from '@/app/lib/utils'
import type {SiteMenuGroup} from '@/sanity/lib/types'
import NavMenuItem from './NavMenuItem'

type Group = SiteMenuGroup & {_key: string}

interface NavMenuItemGroupProps {
  group: Group
  isOpen: boolean
  onToggle: () => void
}

/** The group's cell in the main row: a toggle that inverts while its links are showing. */
export default function NavMenuItemGroup({group, isOpen, onToggle}: NavMenuItemGroupProps) {
  const title = group.title?.trim()
  if (!title) return null

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={groupPanelId(group)}
      className={cn(
        'flex w-full items-center gap-3 px-5 py-3 lg:px-10 lg:py-5 lg:justify-center',
        'text-2xl lg:text-4xl font-bold leading-normal whitespace-nowrap cursor-pointer transition-colors',
        isOpen
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
      )}
    >
      <ExpandIcon isOpen={isOpen} />
      <span>{title}</span>
    </button>
  )
}

interface NavMenuGroupItemsProps {
  group: Group
  pathname: string
  onNavigate: () => void
  className?: string
}

/** A group's links as a ruled row (stacked below `lg`). */
export function NavMenuGroupItems({group, pathname, onNavigate, className}: NavMenuGroupItemsProps) {
  return (
    <ul
      id={groupPanelId(group)}
      role="list"
      aria-label={group.title ?? undefined}
      className={cn(
        'flex flex-col lg:flex-row lg:overflow-x-auto border-black dark:border-white',
        className,
      )}
    >
      {group.items?.map((child) => (
        <li
          key={child._key}
          className="shrink-0 border-b-site last:border-b-0 lg:border-b-0 lg:border-e-site lg:last:border-e-0 border-black dark:border-white"
        >
          <NavMenuItem
            item={child}
            pathname={pathname}
            onNavigate={onNavigate}
            className="ps-12 pe-5 py-3 lg:px-10 lg:py-5 leading-normal lg:leading-normal hover:no-underline hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
          />
        </li>
      ))}
    </ul>
  )
}

const groupPanelId = (group: Group) => `menu-group-panel-${group._key}`

function ExpandIcon({isOpen}: {isOpen: boolean}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 lg:border-[3px]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="w-4 h-4 lg:w-5 lg:h-5"
      >
        <line
          x1="12"
          y1="5"
          x2="12"
          y2="19"
          className={cn('origin-center transition-transform duration-300', isOpen && 'scale-y-0')}
        />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </span>
  )
}
