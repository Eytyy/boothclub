'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'
import ReactLenis, {useLenis} from 'lenis/react'

export function LenisProvider({children}: {children: React.ReactNode}) {
  const pathname = usePathname()

  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.stop()
      requestAnimationFrame(() => {
        lenis.start()
      })
    }
  }, [pathname, lenis])
  return <ReactLenis root>{children}</ReactLenis>
}
