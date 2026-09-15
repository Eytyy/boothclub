'use client'

import React, {type ReactNode, useRef} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import {cn} from '@/app/lib/utils'

const DEFAULT_CARD_CLASSNAME =
  'shrink-0 w-[calc(100%-3.5rem)] sm:w-[calc((100%-1.75rem)/1.5)] md:w-[calc((100%-5rem)/1.5)] lg:w-[calc((100vw-7.5rem)/2.5)] 2xl:w-[calc((100vw-10rem)/4.25)]'

const STAGGER_OFFSET_PX = 140
const STAGGER_STEP = 0.15
const STAGGER_EASE = cubicBezier(0.22, 1, 0.36, 1)

type CardsCarouselProps<T extends {_id: string}> = {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  header?: ReactNode
  cta?: ReactNode
  className?: string
  cardClassName?: string
}

export default function CardsCarousel<T extends {_id: string}>({
  items,
  renderItem,
  header,
  cta,
  className,
  cardClassName,
}: CardsCarouselProps<T>) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
  })
  const shouldAnimate = !reduceMotion

  if (!items.length) return null

  return (
    <section ref={sectionRef} className={cn('flex flex-col gap-6 md:gap-10', className)}>
      <React.Fragment>{header}</React.Fragment>
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className="flex gap-10 px-5 lg:px-10">
          {items.map((item, index) => (
            <CardsCarouselSlide
              key={item._id}
              index={index}
              scrollYProgress={scrollYProgress}
              shouldAnimate={shouldAnimate}
              cardClassName={cardClassName}
            >
              {renderItem(item, index)}
            </CardsCarouselSlide>
          ))}
        </div>
      </div>
      {cta && <div className="flex justify-center px-10">{cta}</div>}
    </section>
  )
}

function CardsCarouselSlide({
  index,
  scrollYProgress,
  shouldAnimate,
  cardClassName,
  children,
}: {
  index: number
  scrollYProgress: MotionValue<number>
  shouldAnimate: boolean
  cardClassName?: string
  children: ReactNode
}) {
  const start = Math.min(index * STAGGER_STEP, 0.9)
  const end = 1
  const y = useTransform(scrollYProgress, [start, end], [STAGGER_OFFSET_PX, 0], {
    ease: STAGGER_EASE,
  })

  return (
    <motion.div
      className={cn(DEFAULT_CARD_CLASSNAME, cardClassName)}
      style={{y: shouldAnimate ? y : 0}}
    >
      {children}
    </motion.div>
  )
}
