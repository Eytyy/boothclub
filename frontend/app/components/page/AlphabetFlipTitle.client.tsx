'use client'

import {useEffect, useState} from 'react'

const STEP_MS = 32

function alphabetRange(target: string): string[] {
  if (target >= 'A' && target <= 'Z') {
    const steps: string[] = []
    for (let code = 65; code <= target.charCodeAt(0); code++) {
      steps.push(String.fromCharCode(code))
    }
    return steps
  }

  if (target >= 'a' && target <= 'z') {
    const steps: string[] = []
    for (let code = 97; code <= target.charCodeAt(0); code++) {
      steps.push(String.fromCharCode(code))
    }
    return steps
  }

  if (target >= '0' && target <= '9') {
    const steps: string[] = []
    for (let code = 48; code <= target.charCodeAt(0); code++) {
      steps.push(String.fromCharCode(code))
    }
    return steps
  }

  return [target]
}

function buildFrames(title: string): string[] {
  const chars = Array.from(title)
  const frames: string[] = []
  let prefix = ''

  for (const char of chars) {
    const steps = alphabetRange(char)
    for (const step of steps) {
      frames.push(prefix + step)
    }
    prefix += char
  }

  return frames
}

type AlphabetFlipTitleProps = {
  text: string
}

export default function AlphabetFlipTitle({text}: AlphabetFlipTitleProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text)
      return
    }

    const frames = buildFrames(text)
    if (frames.length === 0) return

    let index = 0
    const id = window.setInterval(() => {
      setDisplayed(frames[index] ?? text)
      index += 1
      if (index >= frames.length) {
        window.clearInterval(id)
      }
    }, STEP_MS)

    return () => window.clearInterval(id)
  }, [text])

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{displayed}</span>
    </>
  )
}
