'use client'

import LocalizedLink from './LocalizedLink'

interface ArrowLinkProps {
  href: string
  children: React.ReactNode
  onClick?: () => void
}

export default function ArrowLink({href, children, onClick}: ArrowLinkProps) {
  return (
    <LocalizedLink href={href} onClick={onClick} className="inline-flex items-center gap-2">
      {children}
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </LocalizedLink>
  )
}
