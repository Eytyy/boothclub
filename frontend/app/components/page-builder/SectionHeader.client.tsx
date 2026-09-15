'use client'

import {useEffect, useRef, useState} from 'react'
import {motion, useScroll, useSpring, useTransform} from 'framer-motion'

import {cn} from '@/app/lib/utils'

type Props = {
  className?: string
  heading?: string | null
}

/** Only mounted when `heading` is set so `useScroll`’s target ref always hydrates to a real node. */
function SectionHeaderWithScroll({
  heading,
  className,
}: {heading: string} & Pick<Props, 'className'>) {
  const ref = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [overflowAmount, setOverflowAmount] = useState(0)

  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start 0.6', 'end 0.4'],
  })

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -overflowAmount])
  const x = useSpring(rawX, {stiffness: 80, damping: 30, mass: 1})

  useEffect(() => {
    const el = headingRef.current
    if (!el) return

    const measure = () => {
      setOverflowAmount(Math.max(0, el.scrollWidth - el.clientWidth))
    }

    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [heading])

  return (
    <header ref={ref} className={cn('mb-12 overflow-hidden', className)}>
      <motion.h2
        ref={headingRef}
        style={{x}}
        className="whitespace-nowrap text-[10vw] md:text-[12vw] font-bold uppercase leading-none tracking-tight text-center"
      >
        {heading}
      </motion.h2>
    </header>
  )
}

export default function SectionHeader({heading, className}: Props) {
  if (!heading) return null
  return <SectionHeaderWithScroll heading={heading} className={className} />
}
