'use client'

import {useEffect, useState} from 'react'

function readHeaderHeight(): number {
  if (typeof window === 'undefined') return 0
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()
  const parsed = parseFloat(raw)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Returns `true` once the fixed footer panel crosses into the header area,
 * i.e. when `footer.getBoundingClientRect().top <= --header-height`.
 *
 * Uses a passive rAF-throttled scroll/resize listener rather than
 * IntersectionObserver because the footer element is `h-svh`, so its top
 * enters the viewport long before it reaches the header baseline — IO with
 * a top rootMargin fires on "first appearance", not on actual overlap.
 */
export function useFooterOverlap(): boolean {
  const [overlapping, setOverlapping] = useState(false)

  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!footer) return

    let rafId: number | null = null

    const measure = () => {
      rafId = null
      const headerHeight = readHeaderHeight()
      const top = footer.getBoundingClientRect().top
      setOverlapping(top <= headerHeight)
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

  return overlapping
}
