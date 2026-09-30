'use client'

import {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {useReducedMotion} from 'framer-motion'
import {useLenis} from 'lenis/react'

import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {CYCLE_INTERVAL_MS, EXPAND_EASE} from './constants'
import type {FrameRect, ProjectGalleryItem} from './types'

function readRect(node: HTMLElement | null): FrameRect | null {
  if (!node) return null
  const {top, left, width, height} = node.getBoundingClientRect()
  if (width === 0 && height === 0) return null
  return {top, left, width, height}
}

export function useProjectGallery(items: ProjectGalleryItem[]) {
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

  const openGallery = useCallback(() => {
    const origin = readRect(collapsedRef.current)
    if (origin) setOriginRect(origin)
    setCanScroll(false)
    setOverlayVisible(true)
    isExpandedRef.current = true
    setIsExpanded(true)
  }, [])

  const closeGallery = useCallback(() => {
    const origin = readRect(collapsedRef.current)
    if (origin) setOriginRect(origin)
    setCanScroll(false)
    isExpandedRef.current = false
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
    // document.body is only available after hydration, so the portal waits for the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const currentItem = items[selectedIndex] ?? items[0]
  const showCover = isExpanded && !canScroll
  const frameRect = isExpanded ? targetRect : originRect

  return {
    emblaRef,
    collapsedRef,
    targetRef,
    isExpanded,
    overlayVisible,
    isPortalReady,
    canScroll,
    showCover,
    originRect,
    frameRect,
    currentItem,
    frameTransition,
    openGallery,
    closeGallery,
    handleFrameAnimationComplete,
  }
}
