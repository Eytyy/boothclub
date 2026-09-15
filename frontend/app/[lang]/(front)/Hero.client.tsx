'use client'

import Logo from '@/components/ui/Logo.client'
import {useRef, useState, useEffect} from 'react'
import {useScroll, useTransform, useMotionValue, useMotionValueEvent, animate} from 'framer-motion'
import {useHeroState} from '@/app/context/HeroStateContext.client'
import HeroVideo from './HeroVideo.client'
import HeroCTA from './HeroCTA.client'
import HeroTagline from './HeroTagline.client'
import ProjectCarousel from '@/app/components/project/ProjectCarousel.client'
import type {ProjectCardData} from '@/app/components/project/types'
import ArrowButton from '@/components/ui/ArrowButton'
import {useDictionary} from '@/app/lib/i18n/LocaleProvider.client'

export type HeroProps = {
  headline: string
  subheadline?: string
  playbackId?: string | null
  taglineWithVideo?: string
  featuredProjectItems?: ProjectCardData[]
}

export default function Hero({
  headline,
  subheadline,
  playbackId,
  taglineWithVideo,
  featuredProjectItems,
}: HeroProps) {
  const t = useDictionary()
  const [showContent, setShowContent] = useState(false)
  const [logoIntroDone, setLogoIntroDone] = useState(false)

  const videoIntroProgress = useMotionValue(0)

  const logoRef = useRef<HTMLDivElement>(null)
  const videoScrollRef = useRef<HTMLDivElement>(null)
  const inlineVideoSlotRef = useRef<HTMLSpanElement>(null)

  const {scrollYProgress: logoScrollYProgress} = useScroll({
    target: logoRef,
    offset: ['start start', 'end start'],
  })
  const mobileHideProgress = useTransform(logoScrollYProgress, [0, 1], [0, 1])

  const {scrollYProgress: videoScrollY} = useScroll({
    target: videoScrollRef,
    offset: ['start end', 'end start'],
  })
  const flyProgress = useTransform(videoScrollY, [0.5, 0.85], [0, 1])

  const {setIntroScrollProgress, setIntroComplete} = useHeroState()

  useEffect(() => {
    setIntroScrollProgress(mobileHideProgress)
  }, [mobileHideProgress, setIntroScrollProgress])

  useEffect(() => {
    setIntroComplete(logoIntroDone && mobileHideProgress.get() >= 0.95)
  }, [logoIntroDone, mobileHideProgress, setIntroComplete])

  useMotionValueEvent(mobileHideProgress, 'change', (v) => {
    setIntroComplete(logoIntroDone && v >= 0.95)
  })

  useEffect(() => {
    if (!showContent) return
    const controls = animate(videoIntroProgress, 1, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [showContent, videoIntroProgress])

  const contentVariantState = showContent ? 'visible' : 'hidden'

  const hasWork = featuredProjectItems && featuredProjectItems.length > 0

  return (
    <div className="lg:min-h-svh">
      <div ref={logoRef} className="z-10 block px-5 lg:px-10">
        <Logo
          onIntroComplete={() => {
            setLogoIntroDone(true)
            setShowContent(true)
          }}
        />
      </div>
      <HeroCTA animate={contentVariantState} headline={headline} subheadline={subheadline} />
      <div ref={videoScrollRef}>
        <HeroVideo
          introProgress={videoIntroProgress}
          playbackId={playbackId}
          videoScrollY={videoScrollY}
          inlineSlotRef={inlineVideoSlotRef}
        />
      </div>
      {hasWork && (
        <ProjectCarousel
          className="pt-10 lg:pt-0"
          items={featuredProjectItems}
          header={
            taglineWithVideo ? (
              <HeroTagline
                tagline={taglineWithVideo}
                playbackId={playbackId}
                flyProgress={flyProgress}
                inlineSlotRef={inlineVideoSlotRef}
              />
            ) : undefined
          }
          cta={
            <ArrowButton href="/projects" variant="primary">
              {t['actions.allWork']}
            </ArrowButton>
          }
        />
      )}
      {!hasWork && taglineWithVideo && (
        <HeroTagline
          tagline={taglineWithVideo}
          playbackId={playbackId}
          flyProgress={flyProgress}
          inlineSlotRef={inlineVideoSlotRef}
        />
      )}
    </div>
  )
}
