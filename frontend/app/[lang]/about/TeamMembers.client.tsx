'use client'

import {useEffect, useId, useRef, useState} from 'react'

import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import type {AboutPageQueryResult} from '@/sanity.types'

type TeamMember = NonNullable<NonNullable<AboutPageQueryResult>['teamSection']>['members'][number]

/**
 * A row of names. Hovering a name (or tapping / pressing it) shows that member's
 * picture and role in a card just under it.
 */
export default function TeamMembers({members}: {members: TeamMember[]}) {
  const listRef = useRef<HTMLUListElement>(null)
  const idPrefix = useId()
  const [hovered, setHovered] = useState<string | null>(null)
  // Set by a tap, click or Enter/Space, so touch screens and keyboards get the card too.
  const [selected, setSelected] = useState<string | null>(null)
  const shown = hovered ?? selected

  useEffect(() => {
    if (!selected) return
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (
        event instanceof KeyboardEvent
          ? event.key === 'Escape'
          : !listRef.current?.contains(event.target as Node)
      ) {
        setSelected(null)
      }
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [selected])

  const visibleMembers = members.filter((member) => member.name)
  if (!visibleMembers.length) return null

  return (
    <ul
      ref={listRef}
      className="flex flex-wrap justify-between gap-x-10 gap-y-4 px-5 py-5 lg:px-10 lg:py-6"
    >
      {visibleMembers.map((member, index) => {
        const isShown = shown === member._id
        const cardId = `${idPrefix}-${member._id}`
        // Cards at the ends hug the edge so they don't run off the page.
        const align =
          index === 0
            ? 'start-0'
            : index === visibleMembers.length - 1
              ? 'end-0'
              : 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2'

        return (
          <li
            key={member._id}
            className="relative"
            onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(member._id)}
            onPointerLeave={() => setHovered(null)}
          >
            <button
              type="button"
              aria-expanded={isShown}
              aria-controls={cardId}
              onClick={() => setSelected((prev) => (prev === member._id ? null : member._id))}
              className={cn(
                'text-lg lg:text-2xl font-bold uppercase tracking-tight cursor-pointer transition-colors',
                shown && !isShown && 'text-black/25 dark:text-white/25',
              )}
            >
              {member.name}
            </button>
            <div
              id={cardId}
              className={cn(
                'absolute top-full z-30 mt-4 w-44 lg:w-60 border-site border-black bg-white p-3 transition-[opacity,visibility] duration-200 dark:border-white dark:bg-black',
                align,
                isShown ? 'visible opacity-100' : 'invisible opacity-0',
              )}
            >
              {member.image?.asset?._ref ? (
                <div className="aspect-4/5 overflow-hidden">
                  <Image
                    id={member.image.asset._ref}
                    alt={member.image.alt ?? member.name ?? ''}
                    width={480}
                    height={600}
                    mode="cover"
                    hotspot={member.image.hotspot}
                    crop={member.image.crop}
                    preview={member.image.lqip ?? undefined}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <p className="mt-3 font-semibold leading-tight">{member.name}</p>
              {member.role ? (
                <p className="text-sm text-black/60 dark:text-white/60">{member.role}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
