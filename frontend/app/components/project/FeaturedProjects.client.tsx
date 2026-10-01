'use client'

import type {ProjectCardData} from '@/app/components/project/types'
import OverlayArrowButton from '@/app/components/ui/OverlayArrowButton.client'
import SpotlightCaption from '@/app/components/ui/SpotlightCaption'
import SquareMediaStage from '@/app/components/ui/SquareMediaStage'
import {cn} from '@/app/lib/utils'
import {useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import {GridBlock} from '../ui/GridSystem'
import {Locale} from '@/app/lib/i18n/config'
import LocalizedLink from '../ui/LocalizedLink'

const SLIDE_CLASSNAME = 'min-w-0 shrink-0 flex-[0_0_100%] md:flex-[0_0_50%]'

function seeAllProjectsLabel(lang: Locale) {
  return lang === 'ar' ? 'جميع المشاريع' : 'See All Projects'
}

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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: items.length > 2,
    direction,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
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

  const seeAllLabel = seeAllProjectsLabel(lang)

  return (
    <div
      className={cn(
        'border-b-site border-black dark:border-white  z-100 bg-white dark:bg-black relative',
        className,
      )}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-3">
        <div className="relative min-w-0 md:col-span-2">
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
          {/* {canScrollPrev ? (
            <OverlayArrowButton
              direction="prev"
              label="Previous project"
              onClick={scrollPrev}
              className="top-1/2 start-5 left-auto -translate-y-1/2"
            />
          ) : null}
          {canScrollNext ? (
            <OverlayArrowButton
              direction="next"
              label="Next project"
              onClick={scrollNext}
              className="top-1/2 end-5 right-auto bottom-auto -translate-y-1/2"
            />
          ) : null} */}
        </div>
        <GridBlock className="grid grid-rows-[min-content_1fr] gap-5">
          <div className="h-full w-full bg-black dark:bg-white aspect-square" />
          <LocalizedLink
            href="/projects"
            aria-label={seeAllLabel}
            className="text-3xl font-semibold leading-tight"
          >
            {seeAllLabel}
          </LocalizedLink>
        </GridBlock>
      </div>
    </div>
  )
}
