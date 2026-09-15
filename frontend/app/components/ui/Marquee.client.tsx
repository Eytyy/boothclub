'use client'
import {cn} from '@/app/lib/utils'
import React from 'react'

type Tag = keyof React.JSX.IntrinsicElements

export const Marquee = ({
  speed = 100,
  index = 0,
  children,
  as = 'div',
  accessibleText, // single semantic copy for AT/SEO (e.g., your H1 text)
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode
  index?: number
  speed?: number // px/s
  as?: Tag // e.g., "h1" for page title
  accessibleText?: string
  pauseOnHover?: boolean
  className?: string
}) => {
  const [ready, setReady] = React.useState(false)
  const [wrapperWidth, setWrapperWidth] = React.useState(0)
  const [runWidth, setRunWidth] = React.useState(0)
  const [animNonce, setAnimNonce] = React.useState(0)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const Component = as

  React.useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const ro = new ResizeObserver((e) => setWrapperWidth(e[0].contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  React.useEffect(() => {
    let cancelled = false
    const measure = () => {
      const runEl = wrapperRef.current?.querySelector('.marquee-run') as HTMLElement | null
      if (!runEl) return
      const rect = runEl.getBoundingClientRect()
      const style = getComputedStyle(runEl)
      const w = rect.width + parseFloat(style.marginLeft) + parseFloat(style.marginRight)
      if (!cancelled && w > 0) setRunWidth(w)
    }
    void (async () => {
      if ((document as unknown as {fonts?: {ready: Promise<void>}}).fonts?.ready)
        await (document as unknown as {fonts: {ready: Promise<void>}}).fonts.ready
      requestAnimationFrame(() => requestAnimationFrame(measure))
    })()
    const el = wrapperRef.current?.querySelector('.marquee-run')
    const ro = new ResizeObserver(measure)
    if (el) ro.observe(el)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [children])

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const animationSpeed = Math.max(speed, speed + index * 50)
  const duration = runWidth ? runWidth / animationSpeed : 0
  const cloneCount = !prefersReduced && runWidth > 0 ? Math.ceil(wrapperWidth / runWidth) + 1 : 1

  React.useEffect(() => {
    setReady(runWidth > 0 && wrapperWidth > 0 && duration > 0)
  }, [runWidth, wrapperWidth, duration])

  React.useEffect(() => {
    if (ready) {
      void wrapperRef.current?.offsetHeight
      setAnimNonce((n) => n + 1)
    }
  }, [ready, speed])

  const animatedStyles: React.CSSProperties =
    ready && !prefersReduced
      ? {
          ['--run-width' as string]: `${runWidth}px`,
          animationName: 'scrollPx',
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          animationPlayState: 'running',
        }
      : {animation: 'none'}

  return (
    <div className={cn('relative h-32 w-full overflow-hidden', className)} ref={wrapperRef}>
      {/* Semantic copy for AT/SEO */}
      {accessibleText ? <Component className="sr-only">{accessibleText}</Component> : null}
      {/* Visual marquee, hidden from AT and unfocusable */}
      <div
        className={cn(
          'inline-block whitespace-nowrap uppercase',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
        key={animNonce}
        style={animatedStyles}
        aria-hidden="true"
        inert // prevents focus on any interactive descendants
      >
        {Array.from({length: cloneCount}).map((_, i) => (
          <div key={`run-${i}`} className="marquee-run mx-5 inline-block shrink-0 ">
            {children}
          </div>
        ))}
      </div>
    </div>
  )
}
