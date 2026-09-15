import {motion, Variants} from 'framer-motion'
import {useEffect, useRef} from 'react'
import AnimatedWordsText from '@/components/ui/AnimatedWords.client'

const ctaContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.28},
  },
}

const textGroupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.06},
  },
}

const ctaIntroDelayMs = 820

const HeroCTA = ({
  animate: animateState,
  headline,
  subheadline,
  onIntroComplete,
}: {
  animate: 'hidden' | 'visible'
  headline: string
  subheadline?: string
  onIntroComplete?: () => void
}) => {
  const hasNotifiedIntroComplete = useRef(false)

  useEffect(() => {
    if (animateState !== 'visible') {
      hasNotifiedIntroComplete.current = false
      return
    }

    if (hasNotifiedIntroComplete.current) return

    const timeout = window.setTimeout(() => {
      hasNotifiedIntroComplete.current = true
      onIntroComplete?.()
    }, ctaIntroDelayMs)

    return () => window.clearTimeout(timeout)
  }, [animateState, onIntroComplete])

  return (
    <motion.div className="lg:flex lg:flex-col lg:items-center lg:justify-end lg:pt-20 px-5 py-8 lg:py-0">
      <motion.div
        variants={ctaContainerVariants}
        initial="hidden"
        animate={animateState}
        className="flex flex-col items-center justify-center text-center gap-8 lg:gap-8"
      >
        <Headline headline={headline} />
        {subheadline && (
          <motion.p
            variants={textGroupVariants}
            className="text-sm md:text-base lg:text-xl tracking-wide"
          >
            <AnimatedWordsText text={subheadline} />
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default HeroCTA

const Headline = ({headline}: {headline: string}) => {
  return (
    <motion.h1
      variants={textGroupVariants}
      className="flex flex-col items-center leading-[1.1] font-semibold tracking-tight text-black dark:text-white text-xl md:text-4xl 2xl:text-5xl max-w-[40ch]"
    >
      <AnimatedWordsText text={headline} />
    </motion.h1>
  )
}
