'use client'

import {useRef} from 'react'
import {motion, useInView, type Variants} from 'framer-motion'

import type {ExtractPageBuilderType} from '@/sanity/lib/types'
import {cn} from '@/app/lib/utils'

export type StatItem = {
  _key?: string
  value: string | null
  number: number
  suffix?: string | null
  label: string | null
}

type StatsGridProps = {
  items: StatItem[]
  className?: string
  itemClassName?: string
  valueClassName?: string
  labelClassName?: string
  animateOnView?: boolean
  inViewAmount?: number
}

type StatsBlockProps = {
  block: ExtractPageBuilderType<'stats'>
  index: number
  pageType: string
  pageId: string
}

const statItemVariants: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, ease: [0.22, 1, 0.36, 1]},
  },
}

const suffixVariants: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.3, delay: 0.6, ease: [0.22, 1, 0.36, 1]},
  },
}

function RollingDigit({
  target,
  delay,
  isInView,
}: {
  target: number
  delay: number
  isInView: boolean
}) {
  return (
    <span className="inline-block overflow-hidden h-[1em] leading-none">
      <motion.span
        className="flex flex-col"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={{
          hidden: {y: '0%'},
          visible: {
            y: `${-target * 10}%`,
            transition: {
              duration: 0.8 + target * 0.06,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        {Array.from({length: 10}, (_, i) => (
          <span key={i} className="h-[1em] flex items-center justify-center">
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

function StatValue({
  number,
  suffix,
  value,
  isInView,
  valueClassName,
}: {
  number: number
  suffix?: string | null
  value: string | null
  isInView: boolean
  valueClassName?: string
}) {
  const digits = String(number).split('').map(Number)

  return (
    <h2 className={cn('font-bold text-2xl lg:text-5xl 2xl:text-7xl', valueClassName)}>
      {value && <span className="sr-only">{value}</span>}
      <span aria-hidden="true" className="inline-flex">
        {digits.map((digit, i) => (
          <RollingDigit key={i} target={digit} delay={i * 0.05} isInView={isInView} />
        ))}
        {suffix && (
          <motion.span
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={suffixVariants}
          >
            {suffix}
          </motion.span>
        )}
      </span>
    </h2>
  )
}

function StatCard({
  stat,
  className,
  valueClassName,
  labelClassName,
  animateOnView = true,
  inViewAmount = 1,
}: {
  stat: StatItem
  className?: string
  valueClassName?: string
  labelClassName?: string
  animateOnView?: boolean
  inViewAmount?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, {once: true, amount: inViewAmount})
  const shouldShow = animateOnView ? isInView : true

  return (
    <motion.div
      ref={ref}
      className={`text-center${className ? ` ${className}` : ''}`}
      initial="hidden"
      animate={shouldShow ? 'visible' : 'hidden'}
      variants={statItemVariants}
    >
      <StatValue
        number={stat.number}
        suffix={stat.suffix}
        value={stat.value}
        isInView={shouldShow}
        valueClassName={valueClassName}
      />
      {stat.label && (
        <p
          className={`text-sm lg:text-base 2xl:text-lg${labelClassName ? ` ${labelClassName}` : ''}`}
        >
          {stat.label}
        </p>
      )}
    </motion.div>
  )
}

/** Presentational stats grid (rolling digits). */
export function StatsGrid({
  items,
  className,
  itemClassName,
  valueClassName,
  labelClassName,
  animateOnView = true,
  inViewAmount = 1,
}: StatsGridProps) {
  return (
    <div className={className}>
      {items.map((stat) => (
        <StatCard
          key={stat._key ?? stat.value ?? stat.number}
          stat={stat}
          className={itemClassName}
          valueClassName={valueClassName}
          labelClassName={labelClassName}
          animateOnView={animateOnView}
          inViewAmount={inViewAmount}
        />
      ))}
    </div>
  )
}

export default function Stats({block}: StatsBlockProps) {
  const {items} = block

  if (!items?.length) return null

  const statItems: StatItem[] = items.map((item) => ({
    _key: item._key,
    value: item.value,
    number: item.number,
    suffix: item.suffix,
    label: item.label,
  }))

  return (
    <section className="container my-14 lg:my-20">
      <StatsGrid items={statItems} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" />
    </section>
  )
}
