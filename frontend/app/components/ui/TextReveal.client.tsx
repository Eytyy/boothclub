'use client'

import {Fragment, useRef} from 'react'
import {motion, useInView, useReducedMotion} from 'framer-motion'
import {cn} from '@/app/lib/utils'

const ENTER_STAGGER = 0.015
const ENTER_DURATION = 0.1

type TextRevealProps = {
  text: string
  /** Identity for the current string. Change it to replay the reveal. */
  animationKey?: string
  className?: string
  variant?: 'default' | 'compact'
  /**
   * Extra gate on top of the viewport check. Letters stay hidden while this
   * is false. Defaults to true, so the reveal starts once the text is in view.
   */
  active?: boolean
  /** Fires once, after the last character finishes entering. */
  onComplete?: () => void
}

export default function TextReveal({
  text,
  animationKey,
  className,
  variant = 'default',
  active = true,
  onComplete,
}: TextRevealProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, {once: true, amount: 0.6})
  const play = active && isInView
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const key = animationKey ?? text

  const finish = () => {
    if (completed.current) return
    completed.current = true
    onCompleteRef.current?.()
  }

  if (!text) return null

  if (reduceMotion) {
    return (
      <span
        className={cn(
          variant === 'compact' ? 'text-reveal-compact' : 'text-reveal-default',
          className,
        )}
      >
        {text}
      </span>
    )
  }

  const lines = text.split(/\r?\n/).map((line) => line.split(' '))
  let lastCharIndex = -1
  lines.forEach((words, lineIdx) => {
    const charOffset = lines
      .slice(0, lineIdx)
      .reduce((sum, line) => sum + line.join(' ').length + 1, 0)
    words.forEach((word, wordIdx) => {
      if (!word.length) return
      const wordOffset =
        charOffset + words.slice(0, wordIdx).reduce((sum, part) => sum + part.length + 1, 0)
      lastCharIndex = wordOffset + word.length - 1
    })
  })

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        key={key}
        className={cn(
          variant === 'compact' ? 'text-reveal-compact' : 'text-reveal-default',
          className,
        )}
        aria-hidden="true"
      >
        {lines.map((words, lineIdx) => {
          const charOffset = lines
            .slice(0, lineIdx)
            .reduce((sum, line) => sum + line.join(' ').length + 1, 0)
          const lineIsEmpty = words.every((word) => word.length === 0)

          return (
            <span key={`${key}-line-${lineIdx}`} className={lines.length > 1 ? 'block' : undefined}>
              {lineIsEmpty
                ? '\u00A0'
                : words.map((word, wordIdx) => {
                    const wordOffset =
                      charOffset +
                      words.slice(0, wordIdx).reduce((sum, part) => sum + part.length + 1, 0)

                    return (
                      <Fragment key={`${key}-word-${lineIdx}-${wordIdx}`}>
                        <span className="inline-block whitespace-nowrap">
                          {word.split('').map((letter, letterIdx) => {
                            const charIndex = wordOffset + letterIdx
                            const isLast = charIndex === lastCharIndex

                            return (
                              <motion.span
                                key={`${key}-${lineIdx}-${charIndex}`}
                                className="inline-block"
                                initial={{opacity: 0}}
                                animate={
                                  play
                                    ? {
                                        opacity: 1,
                                        transition: {
                                          duration: ENTER_DURATION,
                                          ease: 'easeOut',
                                          delay: charIndex * ENTER_STAGGER,
                                        },
                                      }
                                    : {opacity: 0}
                                }
                                onAnimationComplete={play && isLast ? finish : undefined}
                              >
                                {letter}
                              </motion.span>
                            )
                          })}
                        </span>
                        {wordIdx < words.length - 1 ? ' ' : null}
                      </Fragment>
                    )
                  })}
            </span>
          )
        })}
      </motion.span>
    </>
  )
}
