'use client'

import {
  motion,
  useInView,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import {useCallback, useEffect, useRef, useLayoutEffect, useSyncExternalStore} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'

const HeroVideo = ({
  introProgress,
  playbackId,
  videoScrollY,
  inlineSlotRef,
}: {
  introProgress: MotionValue<number>
  playbackId?: string | null
  videoScrollY: MotionValue<number>
  inlineSlotRef: React.RefObject<HTMLSpanElement | null>
}) => {
  const collapsedLoopSeconds = 3
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<MuxPlayerElement>(null)

  const expandProgress = useTransform(videoScrollY, [0.15, 0.4], [0, 1])
  const flyProgress = useTransform(videoScrollY, [0.5, 0.85], [0, 1])

  const scaleProgress = isDesktop ? expandProgress : undefined

  const introY = useTransform(introProgress, [0, 1], [180, 0])
  const introOpacity = useTransform(introProgress, [0, 1], [0, 1])

  const expandProgressValue = useSyncExternalStore(
    (cb) => expandProgress.on('change', cb),
    () => expandProgress.get(),
    () => 0,
  )

  const flyProgressValue = useSyncExternalStore(
    (cb) => flyProgress.on('change', cb),
    () => flyProgress.get(),
    () => 0,
  )

  const isExpanded = !isDesktop || expandProgressValue >= 0.98

  const deltaX = useMotionValue(0)
  const deltaY = useMotionValue(0)
  const deltaScale = useMotionValue(1)
  const needsRemeasure = useRef(true)

  const measure = useCallback(() => {
    const hero = containerRef.current
    const slot = inlineSlotRef.current
    if (!hero || !slot) return

    // FLIP-style: neutralize both the hero's active transform and the slot's
    // motion-driven width so getBoundingClientRect returns natural layout
    // rects. Without zeroing the hero transform, measuring while the fly is
    // already active (initial load past threshold, or resize mid-fly) yields
    // transformed coordinates and near-zero deltas.
    const prevHeroTransform = hero.style.transform
    hero.style.transform = 'none'

    const slotNaturalWidth = slot.offsetHeight * (16 / 9)
    const prevSlotWidth = slot.style.width
    slot.style.width = `${slotNaturalWidth}px`

    const hr = hero.getBoundingClientRect()
    const sr = slot.getBoundingClientRect()

    slot.style.width = prevSlotWidth
    hero.style.transform = prevHeroTransform

    deltaX.set(sr.left + sr.width / 2 - (hr.left + hr.width / 2))
    deltaY.set(sr.top + sr.height / 2 - (hr.top + hr.height / 2))
    deltaScale.set(sr.width / hr.width)
  }, [inlineSlotRef, deltaX, deltaY, deltaScale])

  useLayoutEffect(() => {
    measure()
    const onResize = () => {
      needsRemeasure.current = true
      measure()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  // Re-measure once the expand phase completes — hero is now at full width
  // and introY is 0, giving us accurate deltas for the fly phase.
  useMotionValueEvent(expandProgress, 'change', (v) => {
    if (v >= 0.98 && needsRemeasure.current) {
      needsRemeasure.current = false
      measure()
    }
  })

  // If the page loads already scrolled past the expand phase, the change
  // event above won't fire. Catch that case on mount.
  useLayoutEffect(() => {
    if (expandProgress.get() >= 0.98) {
      needsRemeasure.current = false
      measure()
    }
  }, [expandProgress, measure])

  const flyX = useTransform([flyProgress, deltaX], ([fly, dx]: number[]) => fly * dx)
  const flyY = useTransform([flyProgress, deltaY], ([fly, dy]: number[]) => fly * dy)
  const flyScale = useTransform(
    [flyProgress, deltaScale],
    ([fly, ds]: number[]) => 1 + Math.sqrt(fly) * (ds - 1),
  )

  const combinedY = useTransform([introY, flyY], (latest: number[]) => latest[0] + latest[1])

  const inView = useInView(containerRef, {amount: 0.6})

  useEffect(() => {
    const player = playerRef.current
    if (!player || !playbackId) return

    if (!inView || flyProgressValue >= 1) {
      player.pause()
      return
    }

    if (!isExpanded && player.currentTime >= collapsedLoopSeconds) {
      player.currentTime = 0
    }

    void player.play().catch(() => {})
  }, [collapsedLoopSeconds, inView, isExpanded, playbackId, flyProgressValue])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !playbackId) return

    const onTimeUpdate = () => {
      if (isExpanded) return
      if (player.currentTime < collapsedLoopSeconds) return
      player.currentTime = 0
      if (player.paused) void player.play().catch(() => {})
    }

    player.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      player.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [collapsedLoopSeconds, isExpanded, playbackId])

  const videoWidthStyle = {
    '--scroll': isDesktop ? scaleProgress : 0,
    'width': 'calc(var(--start-w) + (var(--end-w) - var(--start-w)) * var(--scroll))',
  } as React.CSSProperties

  return (
    <div className="relative">
      <div className="lg:pt-10 px-5 lg:flex lg:flex-col lg:w-full">
        <motion.div
          ref={containerRef}
          style={{
            ...videoWidthStyle,
            y: combinedY,
            opacity: introOpacity,
            x: flyX,
            scale: flyScale,
            visibility: flyProgressValue >= 1 ? ('hidden' as const) : ('visible' as const),
          }}
          className="[--start-w:100%] md:[--start-w:50%] 2xl:[--start-w:50%] [--end-w:100%] aspect-square lg:aspect-video mx-auto overflow-hidden rounded-sm origin-center"
        >
          {playbackId ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={playbackId}
              autoPlay
              muted
              playsInline
              loop
              className="w-full h-full"
              style={
                {
                  '--controls': 'none',
                  '--media-object-fit': 'cover',
                  '--media-object-position': 'center',
                } as React.CSSProperties & Record<string, string>
              }
            />
          ) : (
            <div className="bg-black dark:bg-white w-full h-full" />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default HeroVideo
