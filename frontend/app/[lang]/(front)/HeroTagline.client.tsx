'use client'

import {motion, useTransform, type MotionValue} from 'framer-motion'
import {useRef, useEffect, useLayoutEffect, useMemo, useSyncExternalStore} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import BigText from '@/components/ui/BigText'

type Segment = {type: 'text'; value: string} | {type: 'video'}

function parseTagline(raw: string): Segment[] {
  const parts = raw.split('{{video}}')
  const segments: Segment[] = []
  parts.forEach((part, i) => {
    if (part) segments.push({type: 'text', value: part})
    if (i < parts.length - 1) segments.push({type: 'video'})
  })
  return segments
}

const HeroTagline = ({
  tagline,
  playbackId,
  flyProgress,
  inlineSlotRef,
}: {
  tagline: string
  playbackId?: string | null
  flyProgress: MotionValue<number>
  inlineSlotRef: React.RefObject<HTMLSpanElement | null>
}) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<MuxPlayerElement>(null)

  const segments = useMemo(() => parseTagline(tagline), [tagline])

  const flyProgressValue = useSyncExternalStore(
    (cb) => flyProgress.on('change', cb),
    () => flyProgress.get(),
    () => 0,
  )

  const showInlineVideo = flyProgressValue >= 1

  // Compute the slot's natural width from height + aspect ratio
  const slotNaturalWidthRef = useRef(0)
  useLayoutEffect(() => {
    function measureSlot() {
      const slot = inlineSlotRef.current
      if (!slot) return
      slotNaturalWidthRef.current = slot.offsetHeight * (16 / 9)
    }
    measureSlot()
    window.addEventListener('resize', measureSlot)
    return () => window.removeEventListener('resize', measureSlot)
  }, [inlineSlotRef])

  // Slot width grows from 0 during the fly, fully open at 85% (all viewports)
  const slotWidth = useTransform(flyProgress, (v) => {
    const maxW = slotNaturalWidthRef.current
    if (maxW === 0) return 0
    return Math.min(v / 0.85, 1) * maxW
  })

  useEffect(() => {
    const player = playerRef.current
    if (!player || !playbackId) return
    if (showInlineVideo) {
      void player.play().catch(() => {})
    } else {
      player.pause()
    }
  }, [showInlineVideo, playbackId])

  return (
    <div ref={sectionRef}>
      <BigText as="h2" className="mb-5 lg:mb-0">
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            return (
              <span key={i}>
                {seg.value.split('\n').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </span>
            )
          }

          return (
            <motion.span
              key={i}
              ref={inlineSlotRef}
              className="inline-block align-middle overflow-hidden"
              style={{
                height: '1.35em',
                aspectRatio: '16 / 9',
                width: slotWidth,
              }}
            >
              <motion.span
                className="block w-full h-full"
                initial={{scale: 0, opacity: 0}}
                animate={showInlineVideo ? {scale: 1, opacity: 1} : {scale: 0, opacity: 0}}
                transition={{type: 'spring', stiffness: 260, damping: 20}}
              >
                {playbackId ? (
                  <MuxPlayer
                    ref={playerRef}
                    playbackId={playbackId}
                    autoPlay={false}
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
              </motion.span>
            </motion.span>
          )
        })}
      </BigText>
    </div>
  )
}

export default HeroTagline
