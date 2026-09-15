'use client'

import {useEffect} from 'react'
import {motion, type Variants} from 'framer-motion'

import {logoPaths, logoViewBox} from '@/app/components/ui/logoPaths'
import {cn} from '@/app/lib/utils'

interface LogoProps {
  className?: string
  style?: React.CSSProperties
  onIntroComplete?: () => void
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const pathVariants: Variants = {
  hidden: {y: -560, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 16,
      mass: 0.55,
    },
  },
}

const logoIntroDelayMs = ((logoPaths.length - 1) * 0.08 + 0.26) * 1000

function LetterPath({d}: {d: string}) {
  return <motion.path d={d} fill="currentColor" variants={pathVariants} />
}

export default function Logo({className, style, onIntroComplete}: LogoProps) {
  useEffect(() => {
    if (!onIntroComplete) return
    const timeout = window.setTimeout(() => onIntroComplete(), logoIntroDelayMs)
    return () => window.clearTimeout(timeout)
  }, [onIntroComplete])

  return (
    <motion.div
      className={cn('w-full h-auto overflow-visible', className)}
      style={style}
      initial="hidden"
      animate="visible"
    >
      <motion.svg
        className="w-full h-auto overflow-visible"
        viewBox={logoViewBox}
        fill="none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[...logoPaths].reverse().map((path, index) => (
          <LetterPath key={index} d={path} />
        ))}
      </motion.svg>
    </motion.div>
  )
}
