'use client'

import {motion, useInView, useScroll, useTransform} from 'framer-motion'
import {useRef} from 'react'
import MuxPlayer from '@mux/mux-player-react'
import NextImage from 'next/image'

import Image from '@/app/components/ui/SanityImage.client'
import SanityCtaButton from '@/app/components/ui/SanityCtaButton'
import {useImageCycle} from '@/app/hooks/useImageCycle'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'
import {hasSanityCta} from '@/app/lib/sanity/button'
import type {ExtractPageBuilderType} from '@/sanity/lib/types'
import BigText from '../../ui/BigText'
import SplitLines from '../../ui/SplitLines'

type CtaProps = {
  block: ExtractPageBuilderType<'callToAction'>
  index: number
  pageType: string
  pageId: string
}

type CtaImage = {
  _key: string
  asset?: {_ref?: string | null} | null
  hotspot?: unknown
  crop?: unknown
  lqip?: string | null
}

function CyclingImages({images, className}: {images: CtaImage[]; className?: string}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const isFullyInView = useInView(stageRef, {amount: 'all'})
  const {index} = useImageCycle(images.length, isFullyInView && images.length > 1, 500)

  return (
    <div ref={stageRef} className={`relative w-full h-full ${className ?? ''}`}>
      {images.map((img, i) => {
        if (!img.asset?._ref) return null
        return (
          <div
            key={img._key}
            className="absolute inset-0 transition-opacity duration-200"
            style={{opacity: i === index ? 1 : 0}}
          >
            <Image
              id={img.asset._ref}
              alt=""
              hotspot={img.hotspot as {x: number; y: number} | undefined}
              crop={
                img.crop as {top: number; bottom: number; left: number; right: number} | undefined
              }
              preview={img.lqip ?? undefined}
              width={1000}
              height={675}
              mode="cover"
              className="h-full w-full object-cover"
            />
          </div>
        )
      })}
    </div>
  )
}

export default function CTA({block}: CtaProps) {
  const {tagline, button, mediaType} = block
  const video = block.video as {playbackId?: string; assetId?: string} | null
  const images = (block.images ?? []) as CtaImage[]
  const gif = block.gif as {url?: string} | null

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const scrollRef = useRef<HTMLDivElement>(null)

  const {scrollYProgress} = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  })

  const desktopWidth = useTransform(scrollYProgress, [0, 0.75], ['100%', '50%'])
  const desktopAspect = useTransform(scrollYProgress, [0, 0.75], [16 / 9, 1])
  const mobileWidth = useTransform(scrollYProgress, [0, 0.75], ['100%', '66%'])
  const mobileAspect = useTransform(scrollYProgress, [0, 0.75], [4 / 5, 1])

  // framer-motion renders MotionValues' initial snapshot during SSR, and the
  // wrapper's `aspect-4/5 lg:aspect-video` classes match those snapshots, so we
  // can pass the style directly without an `animationReady` gate.
  const mediaStyle = {
    width: isDesktop ? desktopWidth : mobileWidth,
    aspectRatio: isDesktop ? desktopAspect : mobileAspect,
  }

  const playbackId = video?.playbackId

  const renderMedia = () => {
    const mediaClass = 'w-full h-full object-cover'

    if (mediaType === 'video' || (!mediaType && playbackId)) {
      if (!playbackId) return <div className="bg-black dark:bg-white w-full h-full" />
      return (
        <MuxPlayer
          playbackId={playbackId}
          autoPlay
          muted
          playsInline
          loop
          className={mediaClass}
          style={
            {
              '--controls': 'none',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
            } as React.CSSProperties & Record<string, string>
          }
        />
      )
    }

    if (mediaType === 'images' && images.length > 0) {
      return <CyclingImages images={images} className={mediaClass} />
    }

    if (mediaType === 'gif' && gif?.url) {
      return (
        <div className="relative w-full h-full">
          <NextImage src={gif.url} alt="" fill unoptimized className="object-cover" />
        </div>
      )
    }

    return <span className="bg-black dark:bg-white w-full h-full block" />
  }

  return (
    <div ref={scrollRef} className="pt-10 lg:pt-20 relative h-[150vh] lg:h-[200vh]">
      <div className="flex flex-col items-center justify-center px-5 lg:px-10 sticky top-10 h-screen">
        <motion.div
          className="overflow-hidden w-full aspect-4/5 lg:aspect-video"
          style={mediaStyle}
        >
          {renderMedia()}
        </motion.div>

        {tagline && (
          <div className="pt-10 lg:pb-20 flex flex-col gap-4">
            <BigText as="p">
              <SplitLines text={tagline} />
            </BigText>
            {hasSanityCta(button) && (
              <div className="flex justify-center">
                <SanityCtaButton cta={button} variant="primary" className="block" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
