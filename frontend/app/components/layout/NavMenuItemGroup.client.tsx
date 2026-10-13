'use client'

import {cn} from '@/app/lib/utils'
import type {SiteMenuGroup} from '@/sanity/lib/types'
import NavMenuItem from './NavMenuItem'
import ExpandIcon from '@/app/components/ui/ExpandIcon'

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
        'text-xl lg:text-2xl 3xl:text-3xl font-bold leading-normal whitespace-nowrap cursor-pointer transition-colors',
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
export function NavMenuGroupItems({
  group,
  pathname,
  onNavigate,
  className,
}: NavMenuGroupItemsProps) {
  return (
    <ul
      id={groupPanelId(group)}
      role="list"
      aria-label={group.title ?? undefined}
      className={cn('flex flex-col lg:flex-row border-black dark:border-white', className)}
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
