'use client'

import {type ReactNode, Children, useCallback, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import {cn} from '@/app/lib/utils'

type DotCarouselProps = {
  children: ReactNode
  className?: string
  trackClassName?: string
  slideClassName?: string
  dotsClassName?: string
  viewportClassName?: string
  emblaOptions?: Parameters<typeof useEmblaCarousel>[0]
}

/**
 * One-slide Embla track with full-width slides and a dot pager when `children` length &gt; 1.
 */
export default function DotCarousel({
  children,
  className,
  trackClassName = 'flex',
  slideClassName = 'flex min-w-0 flex-[0_0_100%] justify-center',
  dotsClassName,
  viewportClassName,
  emblaOptions,
}: DotCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, ...emblaOptions})
  const [selectedIndex, setSelectedIndex] = useState(0)
  const count = Children.count(children)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  return (
    <div className={className}>
      <div className={cn('overflow-x-clip', viewportClassName)} ref={emblaRef}>
        <div className={trackClassName}>
          {Children.map(children, (child, index) => (
            <div className={slideClassName} key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div
          className={cn(
            'mt-8 flex justify-center gap-2',
            dotsClassName,
          )}
        >
          {Array.from({length: count}).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === selectedIndex
                  ? 'w-6 bg-black dark:bg-white'
                  : 'w-1.5 bg-black/30 dark:bg-white/30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
