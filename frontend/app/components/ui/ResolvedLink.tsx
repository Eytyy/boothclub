'use client'

import Link from 'next/link'

import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {linkResolver} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'

interface ResolvedLinkProps {
  link: DereferencedLink
  children: React.ReactNode
  className?: string
  onClick?: () => void
  'aria-current'?: React.AriaAttributes['aria-current']
}

export default function ResolvedLink({
  link,
  children,
  className,
  onClick,
  'aria-current': ariaCurrent,
}: ResolvedLinkProps) {
  const lang = useLocale()
  const resolvedLink = linkResolver(link, lang)
  if (typeof resolvedLink === 'string') {
    const isProtocol =
      resolvedLink.startsWith('mailto:') || resolvedLink.startsWith('tel:')
    const isExternalHttp = /^https?:\/\//i.test(resolvedLink)
    const isExternal = link?.linkType === 'href' || isExternalHttp

    // Protocol + absolute http(s) URLs use a native <a>; Next.js Link is for app routes.
    if (isProtocol || isExternalHttp) {
      return (
        <a
          href={resolvedLink}
          target={isExternalHttp ? '_blank' : undefined}
          rel={isExternalHttp ? 'noreferrer nofollow' : undefined}
          className={className}
          onClick={onClick}
          aria-current={ariaCurrent}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        href={resolvedLink}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer nofollow' : undefined}
        className={className}
        onClick={onClick}
        aria-current={ariaCurrent}
      >
        {children}
      </Link>
    )
  }
  return <span className={className}>{children}</span>
}
