'use client'

import {motion, type Variants} from 'framer-motion'

const defaultLineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.05},
  },
}

const defaultWordVariants: Variants = {
  hidden: {},
  visible: {
    transition: {staggerChildren: 0.02},
  },
}

const defaultLetterVariants: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.18, ease: 'easeOut'},
  },
}

type AnimatedLettersProps = {
  text: string
  lineVariants?: Variants
  wordVariants?: Variants
  letterVariants?: Variants
  lineClassName?: string
  wordClassName?: string
  letterClassName?: string
}

export default function AnimatedLetters({
  text,
  lineVariants = defaultLineVariants,
  wordVariants = defaultWordVariants,
  letterVariants = defaultLetterVariants,
  lineClassName = 'block',
  wordClassName = 'inline-block',
  letterClassName = 'inline-block',
}: AnimatedLettersProps) {
  const lines = text.split('\n')
  const tokens = lines.flatMap((line, lineIdx) => {
    const words = line.split(' ').filter(Boolean)
    const wordTokens = words.map((word) => ({type: 'word' as const, value: word}))
    if (lineIdx === lines.length - 1) return wordTokens
    return [...wordTokens, {type: 'line-break' as const}]
  })

  return (
    <motion.span variants={lineVariants} className={lineClassName}>
      {tokens.map((token, tokenIdx) => {
        if (token.type === 'line-break') return <br key={`line-break-${tokenIdx}`} />

        const nextToken = tokens[tokenIdx + 1]
        const hasSpaceAfter = nextToken?.type === 'word'

        return (
          <motion.span key={`word-${tokenIdx}`} variants={wordVariants} className={wordClassName}>
            {token.value.split('').map((letter, letterIdx) => (
              <motion.span
                key={`${letter}-${letterIdx}`}
                variants={letterVariants}
                className={letterClassName}
              >
                {letter}
              </motion.span>
            ))}
            {hasSpaceAfter && <span>&nbsp;</span>}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
