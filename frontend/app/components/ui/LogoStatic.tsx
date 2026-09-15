'use client'

import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {logoFill, logoPaths, logoViewBox} from '@/app/components/ui/logoPaths'

type LogoStaticProps = {
  className?: string
  /** Wrap the wordmark in a link to the home page (default true). */
  linkToHome?: boolean
}

export default function LogoStatic({className, linkToHome = true}: LogoStaticProps) {
  const svg = (
    <svg
      className="w-full h-full overflow-visible"
      viewBox={logoViewBox}
      preserveAspectRatio="xMinYMax meet"
      fill="none"
      aria-hidden
    >
      {[...logoPaths].reverse().map((d, index) => (
        <path key={index} d={d} fill={logoFill} />
      ))}
    </svg>
  )

  const inner = <div className={className ?? 'w-full'}>{svg}</div>

  if (linkToHome) {
    return (
      <LocalizedLink
        href="/"
        className="block w-full max-w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-current/20 focus-visible:ring-offset-2 rounded-sm"
        aria-label="Katch, home"
      >
        {inner}
      </LocalizedLink>
    )
  }

  return inner
}
