'use client'

import {useEffect, useRef, useState} from 'react'

import {cn} from '@/app/lib/utils'

/**
 * Chevron pinned to the bottom of the left column for the height of the
 * main content. The sticky box is one viewport tall, so it releases when
 * the bottom of that content reaches the bottom of the screen — not after
 * the footer has already covered it. The mark stays pointer-transparent
 * until then, so links underneath stay clickable.
 */
export default function ScrollCue() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [released, setReleased] = useState(false)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    let rafId: number | null = null

    const measure = () => {
      rafId = null
      setReleased(anchor.getBoundingClientRect().top < -1)
    }

    const schedule = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, {passive: true})
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={anchorRef}
      className="pointer-events-none sticky top-0 z-30 col-start-1 row-start-1 h-svh self-start "
    >
      <div className="absolute bottom-0 left-10 flex h-[14svh] w-[calc(((100%-5rem)/2)-(var(--border-width-site)/2))] items-center justify-center bg-white dark:bg-black border-l-site border-t-site">
        <button
          type="button"
          tabIndex={released ? 0 : -1}
          aria-label={released ? 'Scroll to top' : undefined}
          onClick={() => {
            if (!released) return
            window.scrollTo({top: 0, behavior: 'smooth'})
          }}
          className={cn(
            'flex flex-col transition-transform duration-300',
            released ? 'pointer-events-auto rotate-180' : 'pointer-events-none',
          )}
        >
          <div className="h-6 w-6 -rotate-45 border-site border-t-0 border-r-0 border-black dark:border-white" />
          <div className="h-6 w-6 -rotate-45 border-site border-t-0 border-r-0 border-black dark:border-white" />
        </button>
      </div>
    </div>
  )
}
