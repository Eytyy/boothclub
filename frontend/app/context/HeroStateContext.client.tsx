'use client'

import {createContext, useContext, useState, type ReactNode} from 'react'
import {type MotionValue, motionValue} from 'framer-motion'

interface HeroStateContextValue {
  introScrollProgress: MotionValue<number>
  setIntroScrollProgress: (mv: MotionValue<number>) => void
  introComplete: boolean
  setIntroComplete: (isComplete: boolean) => void
}

const defaultProgress = motionValue(0)

const HeroStateContext = createContext<HeroStateContextValue>({
  introScrollProgress: defaultProgress,
  setIntroScrollProgress: () => {},
  introComplete: false,
  setIntroComplete: () => {},
})

export function HeroStateProvider({children}: {children: ReactNode}) {
  const [introScrollProgress, setIntroScrollProgress] =
    useState<MotionValue<number>>(defaultProgress)
  const [introComplete, setIntroComplete] = useState(false)

  return (
    <HeroStateContext.Provider
      value={{introScrollProgress, setIntroScrollProgress, introComplete, setIntroComplete}}
    >
      {children}
    </HeroStateContext.Provider>
  )
}

export function useHeroState() {
  return useContext(HeroStateContext)
}
