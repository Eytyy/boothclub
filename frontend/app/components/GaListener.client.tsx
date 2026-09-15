'use client'

import {useEffect} from 'react'
import {usePathname, useSearchParams} from 'next/navigation'

export default function GAListener() {
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    // @ts-expect-error window.gtag is injected at runtime by the GA script
    window.gtag?.('event', 'page_view', {
      page_path: pathname + (search?.toString() ? `?${search}` : ''),
    })
  }, [pathname, search])

  return null
}
