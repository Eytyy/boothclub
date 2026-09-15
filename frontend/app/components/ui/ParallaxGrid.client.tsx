'use client'

import {type ReactNode, useRef} from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import {useMediaQuery} from '@/app/hooks/useMediaQuery'

import {
  getPresetTable,
  getFooterParallaxSpeed,
  type ParallaxPreset,
  type ParallaxVariant,
} from './parallax-presets'

type ColumnBreakpoints = {'sm': number; '2xl': number}

type ParallaxGridProps<T extends {_id: string}> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  variant?: ParallaxVariant
  className?: string
  gridClassName?: string
  footer?: ReactNode
  columns?: ColumnBreakpoints
}

function useSharedMotionValues() {
  const v0 = useMotionValue(0)
  const v1 = useMotionValue(0)
  const v2 = useMotionValue(0)
  const v3 = useMotionValue(0)
  const v4 = useMotionValue(0)
  const v5 = useMotionValue(0)
  return [v0, v1, v2, v3, v4, v5] as const
}

function ParallaxItem<T extends {_id: string}>({
  item,
  index,
  sharedY,
  preset,
  shouldAnimate,
  renderItem,
}: {
  item: T
  index: number
  sharedY: MotionValue<number>
  preset: ParallaxPreset
  shouldAnimate: boolean
  renderItem: (item: T, index: number) => ReactNode
}) {
  return (
    <motion.div
      style={{
        y: shouldAnimate ? sharedY : 0,
        paddingTop: shouldAnimate ? preset.offsetPx : undefined,
      }}
    >
      {renderItem(item, index)}
    </motion.div>
  )
}

function ParallaxFooter({
  speed,
  scrollYProgress,
  shouldAnimate,
  children,
}: {
  speed: [number, number]
  scrollYProgress: MotionValue<number>
  shouldAnimate: boolean
  children: ReactNode
}) {
  const footerY = useTransform(scrollYProgress, [0, 1], [speed[0], speed[1]])

  return (
    <motion.div
      className="flex justify-center"
      style={{gridColumn: '1 / -1', y: shouldAnimate ? footerY : 0}}
    >
      {children}
    </motion.div>
  )
}

const DEFAULT_GRID_CLASS =
  'grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3 md:gap-10 2xl:gap-20 overflow-x-clip'

const DEFAULT_COLUMNS: ColumnBreakpoints = {'sm': 2, '2xl': 3}

export default function ParallaxGrid<T extends {_id: string}>({
  items,
  renderItem,
  variant = 'staggered-6col',
  className,
  gridClassName = DEFAULT_GRID_CLASS,
  footer,
  columns = DEFAULT_COLUMNS,
}: ParallaxGridProps<T>) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMultiCol = useMediaQuery('(min-width: 640px)')
  const is2xl = useMediaQuery('(min-width: 1536px)')
  const reduceMotion = useReducedMotion()

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  })

  const sharedValues = useSharedMotionValues()

  const table = getPresetTable(variant, is2xl)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    for (let i = 0; i < table.length; i++) {
      const {speed} = table[i]!
      sharedValues[i]!.set(speed[0] + progress * (speed[1] - speed[0]))
    }
  })

  const shouldAnimate = isMultiCol && !reduceMotion
  const cols = is2xl ? columns['2xl'] : columns.sm
  const footerSpeed = footer ? getFooterParallaxSpeed(variant, items.length, cols, is2xl) : null

  return (
    <div ref={sectionRef} className={className}>
      <div className={gridClassName}>
        {items.map((item, index) => {
          const presetIndex = index % table.length
          return (
            <ParallaxItem
              key={item._id}
              item={item}
              index={index}
              sharedY={sharedValues[presetIndex]!}
              preset={table[presetIndex]!}
              shouldAnimate={shouldAnimate}
              renderItem={renderItem}
            />
          )
        })}
        {footer && footerSpeed && (
          <ParallaxFooter
            speed={footerSpeed}
            scrollYProgress={scrollYProgress}
            shouldAnimate={shouldAnimate}
          >
            {footer}
          </ParallaxFooter>
        )}
      </div>
    </div>
  )
}
