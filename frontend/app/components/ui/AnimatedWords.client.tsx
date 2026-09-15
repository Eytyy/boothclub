'use client'

import {motion, type Variants} from 'framer-motion'

const defaultLineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.04},
  },
}

const defaultWordWrapperVariants: Variants = {
  hidden: {},
  visible: {},
}

const defaultWordVariants: Variants = {
  hidden: {y: '100%'},
  visible: {
    y: 0,
    transition: {duration: 0.45, ease: [0.22, 1, 0.36, 1]},
  },
}

type AnimatedWordsProps = {
  text: string
  lineVariants?: Variants
  wordWrapperVariants?: Variants
  wordVariants?: Variants
  lineClassName?: string
  wordClassName?: string
  wordInnerClassName?: string
}

export default function AnimatedWords({
  text,
  lineVariants = defaultLineVariants,
  wordWrapperVariants = defaultWordWrapperVariants,
  wordVariants = defaultWordVariants,
  lineClassName = 'block',
  wordClassName = 'inline-block overflow-hidden align-bottom',
  wordInnerClassName = 'inline-block',
}: AnimatedWordsProps) {
  const lines = text.split('\n')

  return (
    <>
      {lines.map((line, lineIdx) => {
        const words = line.split(' ').filter(Boolean)
        return (
          <motion.span key={`${line}-${lineIdx}`} variants={lineVariants} className={lineClassName}>
            {words.map((word, wordIdx) => (
              <motion.span
                key={`${word}-${wordIdx}`}
                variants={wordWrapperVariants}
                className={wordClassName}
              >
                <motion.span variants={wordVariants} className={wordInnerClassName}>
                  {word}
                </motion.span>
                {wordIdx < words.length - 1 && <span>&nbsp;</span>}
              </motion.span>
            ))}
          </motion.span>
        )
      })}
    </>
  )
}
