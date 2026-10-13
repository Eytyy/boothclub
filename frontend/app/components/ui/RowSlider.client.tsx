'use client'

import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {AnimatePresence, motion} from 'framer-motion'

import {cn} from '@/app/lib/utils'

type Direction = 'prev' | 'next'

/**
 * Lets a ruled row of items overflow sideways. Pass the row as the only child; its children are
 * the items. The row stays a native scroller (trackpad, touch and tab-into-view keep working)
 * with its scrollbar hidden. From `lg` up, arrows sit over its ends, so they don't shift the
 * items when they come and go. An arrow only shows while there are items hidden on its side,
 * and a click brings the nearest item hidden under it flush against the opposite arrow.
 * Below `lg` it is swipe-only.
 */
export default function RowSlider({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScroll, setCanScroll] = useState({prev: false, next: false})

  const update = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    // `scrollLeft` runs negative in RTL, so measure distance from the start either way.
    const offset = Math.abs(scroller.scrollLeft)
    const max = scroller.scrollWidth - scroller.clientWidth
    // 1px of slack absorbs sub-pixel layout.
    const prev = offset > 1
    const next = offset < max - 1
    setCanScroll((current) =>
      current.prev === prev && current.next === next ? current : {prev, next},
    )
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    // Watch the items themselves: the row keeps the scroller's width while items are swapped
    // out or reflow (a font loading, say), so only their sizes reveal the overflow changing.
    const resizes = new ResizeObserver(update)
    const observeAll = () => {
      resizes.disconnect()
      resizes.observe(scroller)
      for (const item of scroller.firstElementChild?.children ?? []) resizes.observe(item)
      update()
    }
    observeAll()
    const mutations = new MutationObserver(observeAll)
    mutations.observe(scroller, {childList: true, subtree: true})
    scroller.addEventListener('scroll', update, {passive: true})
    return () => {
      resizes.disconnect()
      mutations.disconnect()
      scroller.removeEventListener('scroll', update)
    }
  }, [update])

  const scroll = (direction: Direction, arrowWidth: number) => {
    const scroller = scrollerRef.current
    const items = scroller?.firstElementChild?.children
    if (!scroller || !items?.length) return

    const isRtl = getComputedStyle(scroller).direction === 'rtl'
    const view = scroller.getBoundingClientRect()
    // The visible window between the two arrows, in screen coordinates.
    const left = view.left + arrowWidth
    const right = view.right - arrowWidth
    // Whether the arrow points at the physical right; `next` heads to the inline end.
    const towardRight = (direction === 'next') !== isRtl

    // Target the clipped item nearest the arrow, picked by position so RTL order doesn't matter.
    const rects = Array.from(items, (item) => item.getBoundingClientRect())
    let delta = 0
    if (towardRight) {
      const clipped = rects.filter((rect) => rect.right > right + 1)
      if (clipped.length) delta = Math.min(...clipped.map((rect) => rect.left)) - left
    } else {
      const clipped = rects.filter((rect) => rect.left < left - 1)
      if (clipped.length) delta = Math.max(...clipped.map((rect) => rect.right)) - right
    }
    // An item wider than the window is already flush, so page by the window instead.
    if (Math.abs(delta) < 1) delta = (right - left) * (towardRight ? 1 : -1)
    scroller.scrollBy({left: delta, behavior: 'smooth'})
  }

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollerRef}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <AnimatePresence initial={false}>
        {canScroll.prev && (
          <SliderArrow key="prev" direction="prev" onClick={(width) => scroll('prev', width)} />
        )}
        {canScroll.next && (
          <SliderArrow key="next" direction="next" onClick={(width) => scroll('next', width)} />
        )}
      </AnimatePresence>
    </div>
  )
}

/** Fills its positioned parent's height at one end. Visible from `lg` up unless `className` says otherwise. */
export function SliderArrow({
  direction,
  onClick,
  className,
}: {
  direction: Direction
  onClick: (arrowWidth: number) => void
  className?: string
}) {
  const isPrev = direction === 'prev'

  return (
    <motion.button
      type="button"
      aria-label={isPrev ? 'Scroll back' : 'Scroll forward'}
      // Pointer users have the arrows; keyboard users reach every item by tabbing.
      tabIndex={-1}
      onClick={(event) => onClick(event.currentTarget.offsetWidth)}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.2}}
      className={cn(
        'absolute inset-y-0 z-10 hidden lg:flex items-center justify-center px-6 cursor-pointer',
        'bg-white text-black dark:bg-black dark:text-white border-black dark:border-white',
        'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors',
        isPrev ? 'start-0 border-e-site' : 'end-0 border-s-site',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full border-[3px]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Drawn pointing right; `prev` points to the inline start, and RTL mirrors both.
          className={cn('w-5 h-5', isPrev ? 'rotate-180 rtl:rotate-0' : 'rtl:rotate-180')}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      </span>
    </motion.button>
  )
}
