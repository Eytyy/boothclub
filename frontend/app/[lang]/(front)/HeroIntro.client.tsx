'use client'

import {createContext, useCallback, useContext, useState, type ReactNode} from 'react'

import TextReveal from '@/app/components/ui/TextReveal.client'

const HeroIntroContext = createContext({ready: true, start: () => {}})

/**
 * Holds the hero reels until the intro text starts revealing. The reels are CSS and would
 * otherwise start on first paint, while the text waits for hydration.
 * With no intro text there is nothing to wait for, so the reels start straight away.
 */
export function HeroIntroProvider({
  hasIntroText,
  children,
}: {
  hasIntroText: boolean
  children: ReactNode
}) {
  const [ready, setReady] = useState(!hasIntroText)
  const start = useCallback(() => setReady(true), [])

  return <HeroIntroContext.Provider value={{ready, start}}>{children}</HeroIntroContext.Provider>
}

/** Intro text whose reveal releases the hero reels. */
export function HeroIntroText({text, className}: {text: string; className?: string}) {
  const {start} = useContext(HeroIntroContext)
  return <TextReveal className={className} text={text} onStart={start} />
}

export function useHeroIntroReady() {
  return useContext(HeroIntroContext).ready
}
