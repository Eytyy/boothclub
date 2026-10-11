'use client'

import type {ProjectCardData} from '@/app/components/project/types'
import SectionHeading from '@/app/components/ui/SectionHeading'
import SpotlightCaption from '@/app/components/ui/SpotlightCaption'
import SquareMediaStage from '@/app/components/ui/SquareMediaStage'
import {cn} from '@/app/lib/utils'
import {useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import {GridBlock} from '../ui/GridSystem'
import {Locale} from '@/app/lib/i18n/config'
import LocalizedLink from '../ui/LocalizedLink'

// Three across from `lg`, one per column of the page's [4, 4, 4] grid.
const SLIDE_CLASSNAME =
  'min-w-0 shrink-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_calc(100%/3)]'

function allProjectsLabel(lang: Locale) {
  return lang === 'ar' ? 'جميع المشاريع' : 'All Projects'
}

/**
 * A header row over the cards: the heading sits above the first column, the carousel arrows
 * above the second and the all-projects link above the third. The arrows only show once there
 * are more cards than fit; below `lg` the carousel is swipe-only, and below `sm` the link
 * drops under the heading.
 */
export default function FeaturedProjects({
  items,
  heading = 'Featured Projects',
  className,
  lang,
}: {
  items: ProjectCardData[]
  heading?: string
  className?: string
  lang: Locale
}) {
  const direction = lang === 'ar' ? 'rtl' : 'ltr'
  const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start', direction})
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    // Embla has already initialised by now, so read its first state rather than wait for an event.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect()
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('reInit', onSelect)
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!items.length) {
    return null
  }

  const allLabel = allProjectsLabel(lang)
  const hasOverflow = canScrollPrev || canScrollNext

  return (
    <div
      className={cn(
        'border-b-site border-black dark:border-white z-100 bg-white dark:bg-black relative',
        className,
      )}
    >
      <div className="grid sm:grid-cols-[1fr_auto] lg:grid-cols-3 items-center">
        <SectionHeading>{heading}</SectionHeading>
        <div
          className={cn(
            'hidden justify-end gap-4 p-5 lg:p-10 pb-0 lg:pb-0',
            hasOverflow && 'lg:flex',
          )}
        >
          <CarouselArrow direction="prev" disabled={!canScrollPrev} onClick={scrollPrev} />
          <CarouselArrow direction="next" disabled={!canScrollNext} onClick={scrollNext} />
        </div>
        <div className="flex sm:justify-end p-5 lg:p-10 pb-0 lg:pb-0 lg:col-start-3">
          <LocalizedLink
            href="/projects"
            className="flex items-center gap-3 text-lg font-bold uppercase whitespace-nowrap hover:underline underline-offset-4"
          >
            {allLabel}
            <ArrowIcon className="rtl:rotate-180" />
          </LocalizedLink>
        </div>
      </div>
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={item._id} className={SLIDE_CLASSNAME}>
              <GridBlock className="grid grid-rows-[min-content_1fr] gap-5">
                <SquareMediaStage
                  href={`/projects/${item.slug}`}
                  label={`View ${item.title}`}
                  image={item.mainImage}
                />
                <SpotlightCaption title={item.title} />
              </GridBlock>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const isPrev = direction === 'prev'
  return (
    <button
      type="button"
      aria-label={isPrev ? 'Previous projects' : 'Next projects'}
      disabled={disabled}
      onClick={onClick}
      className="p-1 cursor-pointer transition-opacity hover:opacity-60 disabled:opacity-25 disabled:cursor-default"
    >
      {/* Drawn pointing right; `prev` points to the inline start, and RTL mirrors both. */}
      <ArrowIcon className={isPrev ? 'rotate-180 rtl:rotate-0' : 'rtl:rotate-180'} />
    </button>
  )
}

function ArrowIcon({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 17 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-[17px] h-[15px] shrink-0', className)}
      aria-hidden="true"
    >
      <line x1="1" y1="7.5" x2="16" y2="7.5" />
      <polyline points="9.5 1 16 7.5 9.5 14" />
    </svg>
  )
}
