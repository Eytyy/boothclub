'use client'

import {useId, useState, type ReactNode} from 'react'
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion'

import {cn} from '@/app/lib/utils'
import ExpandIcon from '@/app/components/ui/ExpandIcon'

export type FaqItem = {id: string; question: string; answer: ReactNode}

const panelTransition = {duration: 0.3, ease: [0.22, 1, 0.36, 1]} as const

/** Ruled question rows; each opens its answer in place. Several can be open at once. */
export default function FaqAccordion({items}: {items: FaqItem[]}) {
  const baseId = useId()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState<Set<string>>(() => new Set())

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <ul>
      {items.map((item) => {
        const isOpen = open.has(item.id)
        const buttonId = `${baseId}-${item.id}-q`
        const panelId = `${baseId}-${item.id}-a`
        return (
          <li
            key={item.id}
            className="border-b-site last:border-b-0 border-black dark:border-white"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center gap-5 p-5 lg:p-10 text-start text-lg lg:text-2xl font-bold cursor-pointer transition-colors',
                  'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
                  'focus-visible:outline-2 focus-visible:-outline-offset-4',
                )}
              >
                <ExpandIcon isOpen={isOpen} />
                <span>{item.question}</span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden"
                  initial={reduceMotion ? false : {height: 0}}
                  animate={{height: 'auto'}}
                  exit={reduceMotion ? undefined : {height: 0}}
                  transition={panelTransition}
                >
                  <div className="body-text pe-5 pb-5 ps-18 lg:pe-10 lg:pb-10 lg:ps-25 max-w-200">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}
