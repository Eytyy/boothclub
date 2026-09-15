'use client'

import type {ReactNode} from 'react'
import {HeroStateProvider} from '@/app/context/HeroStateContext.client'
import {LenisProvider} from '@/app/context/LenisProvider.client'

export default function Providers({children}: {children: ReactNode}) {
  return (
    <LenisProvider>
      <HeroStateProvider>{children}</HeroStateProvider>
    </LenisProvider>
  )
}
