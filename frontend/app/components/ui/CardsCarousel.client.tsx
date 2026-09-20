'use client'

import React, {type ReactNode, useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'

const PEEK_CARD_CLASSNAME =
  'shrink-0 w-[calc(100%-3.5rem)] sm:w-[calc((100%-1.75rem)/1.5)] md:w-[calc((100%-5rem)/1.5)] lg:w-[calc((100vw-7.5rem)/2.5)] 2xl:w-[calc((100vw-10rem)/4.25)]'

const SINGLE_CARD_CLASSNAME = 'min-w-0 shrink-0 flex-[0_0_100%]'

type CardsCarouselVariant = 'peek' | 'single'

export type CardsCarouselControls = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

type CardsCarouselProps<T extends {_id: string}> = {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  header?: ReactNode
  cta?: ReactNode
  controls?: (nav: CardsCarouselControls) => ReactNode
  className?: string
  cardClassName?: string
  variant?: CardsCarouselVariant
}

export default function CardsCarousel<T extends {_id: string}>({
  items,
  renderItem,
  header,
  cta,
  controls,
  className,
  cardClassName,
  variant = 'peek',
}: CardsCarouselProps<T>) {
  const isSingle = variant === 'single'
  const locale = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const [emblaRef, emblaApi] = useEmblaCarousel(
    isSingle
      ? {align: 'start', loop: items.length > 1, direction}
      : {align: 'start', containScroll: 'trimSnaps', dragFree: true, direction},
  )
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

  if (!items.length) return null

  return (
    <section className={cn('flex min-w-0 flex-col gap-6 md:gap-10', className)}>
      <React.Fragment>{header}</React.Fragment>
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className={cn('flex', !isSingle && 'gap-10 px-5 lg:px-10')}>
          {items.map((item, index) => (
            <div
              key={item._id}
              className={cn(isSingle ? SINGLE_CARD_CLASSNAME : PEEK_CARD_CLASSNAME, cardClassName)}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      {controls?.({scrollPrev, scrollNext, canScrollPrev, canScrollNext})}
      {cta && <div className="flex justify-center px-10">{cta}</div>}
    </section>
  )
}
