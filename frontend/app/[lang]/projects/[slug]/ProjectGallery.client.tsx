'use client'

import {useCallback, useEffect, useState, type TransitionEvent} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import type {PageImage} from '@/app/components/page/types'
import Image from '@/app/components/ui/SanityImage.client'
import OverlayArrowButton from '@/app/components/ui/OverlayArrowButton.client'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'

const CYCLE_INTERVAL_MS = 500

export type ProjectGalleryItem = {
  id: string
  image?: PageImage
}

export default function ProjectGallery({items}: {items: ProjectGalleryItem[]}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const locale = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const canNavigate = items.length > 1

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    watchDrag: false,
    direction,
  })

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.reInit({
      align: 'start',
      loop: isExpanded && canNavigate,
      watchDrag: isExpanded && canNavigate,
      direction,
    })
  }, [emblaApi, canNavigate, direction, isExpanded])

  useEffect(() => {
    if (!emblaApi || isExpanded || !canNavigate) return
    const interval = setInterval(() => {
      const nextIndex = (emblaApi.selectedScrollSnap() + 1) % items.length
      emblaApi.scrollTo(nextIndex, true)
    }, CYCLE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [emblaApi, canNavigate, isExpanded, items.length])

  const handleFrameTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return
      emblaApi?.reInit()
    },
    [emblaApi],
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (items.length === 0) {
    return null
  }

  return (
    <div className="relative flex aspect-square items-center justify-center">
      <button
        type="button"
        className="pointer-events-auto absolute top-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black p-5 text-lg font-bold text-white uppercase hover:bg-white hover:text-black"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Collapse gallery' : 'Expand gallery'}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span aria-hidden="true">{isExpanded ? '–' : '+'}</span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-[width,height] duration-500 ease-out',
          isExpanded ? 'h-full w-full' : 'h-1/2 w-1/2',
        )}
        onTransitionEnd={handleFrameTransitionEnd}
      >
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {items.map((item) => {
              const imageRef = item.image?.asset?._ref
              return (
                <div key={item.id} className="min-w-0 h-full shrink-0 flex-[0_0_100%]">
                  {imageRef && item.image ? (
                    <Image
                      id={imageRef}
                      alt={item.image.alt || ''}
                      className="h-full w-full object-cover"
                      width={1200}
                      height={1200}
                      mode="cover"
                      hotspot={item.image.hotspot ?? undefined}
                      crop={item.image.crop ?? undefined}
                      preview={item.image.lqip ?? undefined}
                    />
                  ) : (
                    <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {isExpanded && canNavigate ? (
        <>
          <OverlayArrowButton
            direction="prev"
            label="Previous image"
            onClick={scrollPrev}
            className="z-10"
          />
          <OverlayArrowButton
            direction="next"
            label="Next image"
            onClick={scrollNext}
            className="z-10"
          />
        </>
      ) : null}
    </div>
  )
}
