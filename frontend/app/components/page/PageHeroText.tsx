import type {ReactNode} from 'react'

import PortableText from '@/app/components/ui/PortableText'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {PortableTextBlock} from 'next-sanity'
import PageTitle from '../ui/PageTitle'
import {cn} from '@/app/lib/utils'

type PageHeroTextProps = {
  title: string
  eyebrow?: string | null
  eyebrowHref?: string | null
  meta?: ReactNode
  tagline?: string | null
  description?: PortableTextBlock[] | null
  className?: string
}

export default function PageHeroText({
  title,
  eyebrow,
  eyebrowHref,
  meta,
  tagline,
  description,
  className,
}: PageHeroTextProps) {
  return (
    <div className={cn('space-y-5 flex flex-col', className)}>
      <header className="space-y-2">
        {eyebrow && eyebrowHref ? (
          <LocalizedLink
            href={eyebrowHref}
            className="inline-block text-sm font-semibold uppercase tracking-wide hover:underline"
          >
            {eyebrow}
          </LocalizedLink>
        ) : null}
        <PageTitle as="h1">{title}</PageTitle>
        {meta ? <p className="text-sm text-black/50 dark:text-white/50">{meta}</p> : null}
      </header>
      {tagline ? <p className="text-6xl font-bold  2xl:max-w-[36ch]">{tagline}</p> : null}
      {description && description.length > 0 ? (
        <PortableText className="body-text" value={description} />
      ) : null}
    </div>
  )
}
