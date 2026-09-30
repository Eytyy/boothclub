'use client'

import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import useEmblaCarousel from 'embla-carousel-react'
import {motion, useReducedMotion} from 'framer-motion'
import {useLenis} from 'lenis/react'

import type {PageImage} from '@/app/components/page/types'
import Image from '@/app/components/ui/SanityImage.client'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'

const CYCLE_INTERVAL_MS = 500
const FALLBACK_SIZE = 1600
const EXPAND_EASE = [0.22, 1, 0.36, 1] as const

const toggleButtonClassName =
  'pointer-events-auto absolute top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black p-5 text-lg font-bold text-white uppercase hover:bg-white hover:text-black'

export type ProjectGalleryItem = {
  id: string
  image?: PageImage
  width?: number
  height?: number
}

type FrameRect = {
  top: number
  left: number
  width: number
  height: number
}

function readRect(node: HTMLElement | null): FrameRect | null {
  if (!node) return null
  const {top, left, width, height} = node.getBoundingClientRect()
  if (width === 0 && height === 0) return null
  return {top, left, width, height}
}

function GalleryPhoto({
  item,
  width,
  height,
}: {
  item: ProjectGalleryItem
  width: number
  height: number
}) {
  const imageRef = item.image?.asset?._ref
  if (!imageRef || !item.image) {
    return <div className="h-full w-full bg-black/5 dark:bg-white/5" />
  }

  return (
    <Image
      id={imageRef}
      alt={item.image.alt || ''}
      className="h-full w-full object-cover"
      width={width}
      height={height}
      mode="cover"
      hotspot={item.image.hotspot ?? undefined}
      crop={item.image.crop ?? undefined}
      preview={item.image.lqip ?? undefined}
    />
  )
}

export default function ProjectGallery({items}: {items: ProjectGalleryItem[]}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [canScroll, setCanScroll] = useState(false)
  const [isPortalReady, setIsPortalReady] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [originRect, setOriginRect] = useState<FrameRect | null>(null)
  const [targetRect, setTargetRect] = useState<FrameRect | null>(null)

  const collapsedRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const isExpandedRef = useRef(false)

  const locale = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const canNavigate = items.length > 1
  const lenis = useLenis()
  const reduceMotion = useReducedMotion()
  const frameTransition = {
    duration: reduceMotion ? 0 : 0.5,
    ease: EXPAND_EASE,
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    watchDrag: false,
    direction,
  })

  isExpandedRef.current = isExpanded

  const openGallery = useCallback(() => {
    const origin = readRect(collapsedRef.current)
    if (origin) setOriginRect(origin)
    setCanScroll(false)
    setOverlayVisible(true)
    setIsExpanded(true)
  }, [])

  const closeGallery = useCallback(() => {
    const origin = readRect(collapsedRef.current)
    if (origin) setOriginRect(origin)
    setCanScroll(false)
    setIsExpanded(false)
  }, [])

  const handleFrameAnimationComplete = useCallback(() => {
    if (isExpandedRef.current) {
      setCanScroll(true)
      return
    }
    setOverlayVisible(false)
  }, [])

  useEffect(() => {
    setIsPortalReady(true)
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit({
      align: 'start',
      loop: false,
      watchDrag: false,
      direction,
    })
  }, [emblaApi, direction])

  useEffect(() => {
    if (!emblaApi) return
    const sync = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    sync()
    emblaApi.on('select', sync)
    emblaApi.on('reInit', sync)
    return () => {
      emblaApi.off('select', sync)
      emblaApi.off('reInit', sync)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || overlayVisible || !canNavigate) return
    const interval = setInterval(() => {
      const nextIndex = (emblaApi.selectedScrollSnap() + 1) % items.length
      emblaApi.scrollTo(nextIndex, true)
    }, CYCLE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi, canNavigate, overlayVisible, items.length])

  useLayoutEffect(() => {
    if (!overlayVisible) return

    const measure = () => {
      const next = readRect(targetRef.current)
      if (next) setTargetRect(next)
    }

    measure()
    if (!isExpanded) return
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isExpanded, overlayVisible])

  useEffect(() => {
    if (!overlayVisible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lenis?.stop()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGallery()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      lenis?.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeGallery, lenis, overlayVisible])

  if (items.length === 0) {
    return null
  }

  const currentItem = items[selectedIndex] ?? items[0]
  const showCover = isExpanded && !canScroll
  const frameRect = isExpanded ? targetRect : originRect

  const overlay =
    isPortalReady && overlayVisible
      ? createPortal(
          <div className="fixed inset-0 z-30">
            <motion.div
              className="absolute inset-0 bg-white dark:bg-black"
              initial={{opacity: 0}}
              animate={{opacity: isExpanded ? 1 : 0}}
              transition={frameTransition}
            />
            {originRect && frameRect ? (
              <motion.div
                className="fixed overflow-hidden bg-white dark:bg-black"
                initial={originRect}
                animate={frameRect}
                transition={frameTransition}
                onAnimationComplete={handleFrameAnimationComplete}
                role="dialog"
                aria-modal="true"
                aria-label="Project gallery"
              >
                <div
                  className={cn(
                    'absolute inset-0 z-10 transition-opacity duration-200',
                    showCover ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                >
                  <GalleryPhoto item={currentItem} width={1200} height={1200} />
                </div>
                <div
                  className={cn(
                    'h-full',
                    canScroll ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden',
                  )}
                  data-lenis-prevent
                >
                  <div className="space-y-10">
                    {items.map((item) => {
                      const width = item.width ?? FALLBACK_SIZE
                      const height = item.height ?? FALLBACK_SIZE
                      return (
                        <div
                          key={item.id}
                          className="w-full"
                          style={{aspectRatio: `${width} / ${height}`}}
                        >
                          <GalleryPhoto item={item} width={width} height={height} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null}
            <div className="pointer-events-none absolute inset-0">
              <div className="container h-full">
                <div className="relative mx-10 h-svh border-x-site border-black dark:border-white">
                  <button
                    type="button"
                    className={`${toggleButtonClassName} end-5`}
                    aria-expanded={true}
                    aria-label="Collapse gallery"
                    onClick={closeGallery}
                  >
                    <span aria-hidden="true">–</span>
                  </button>
                  <div ref={targetRef} className="absolute inset-10" />
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="relative flex aspect-square items-center justify-center">
      <button
        type="button"
        className={cn(toggleButtonClassName, 'right-5', overlayVisible && 'invisible')}
        aria-expanded={isExpanded}
        aria-label="Expand gallery"
        onClick={openGallery}
      >
        <span aria-hidden="true">+</span>
      </button>
      <div
        ref={collapsedRef}
        className={cn('h-1/2 w-1/2 overflow-hidden', overlayVisible && 'invisible')}
      >
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {items.map((item) => (
              <div key={item.id} className="min-w-0 h-full shrink-0 flex-[0_0_100%]">
                <GalleryPhoto item={item} width={1200} height={1200} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {overlay}
    </div>
  )
}
