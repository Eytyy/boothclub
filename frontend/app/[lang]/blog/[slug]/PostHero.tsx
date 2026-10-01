import type {ReactNode} from 'react'

import DateComponent from '@/app/components/ui/Date'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import PageTitle from '@/app/components/ui/PageTitle'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import type {PostQueryResult} from '@/sanity.types'

type CoverImage = NonNullable<PostQueryResult>['coverImage']

function Chip({children, className}: {children: ReactNode; className?: string}) {
  return <div className={cn('w-fit max-w-full bg-white text-black', className)}>{children}</div>
}

export default function PostHero({
  title,
  date,
  coverImage,
}: {
  title: string
  date?: string | null
  coverImage?: CoverImage | null
}) {
  return (
    <div className="p-10 pb-0">
      <div className="relative">
        {coverImage?.asset?._ref ? (
          <Image
            id={coverImage.asset._ref}
            alt={coverImage.alt || ''}
            className="w-full object-cover"
            width={1600}
            height={900}
            mode="cover"
            hotspot={coverImage.hotspot}
            crop={coverImage.crop}
            preview={coverImage.lqip ?? undefined}
          />
        ) : (
          <div className="aspect-video w-full bg-gray-200" />
        )}
        <div className="absolute top-0 left-0 flex flex-col items-start gap-2 p-10">
          <Chip className="px-3 py-1.5 lg:px-4 lg:py-2">
            <LocalizedLink
              href="/blog"
              className="inline-block text-sm font-semibold uppercase tracking-wide hover:underline"
            >
              blog
            </LocalizedLink>
          </Chip>
          <Chip className="px-4 py-2 lg:px-5 lg:py-3">
            <PageTitle as="h1">{title}</PageTitle>
          </Chip>
          {date ? (
            <Chip className="px-3 py-1.5 text-sm lg:px-4 lg:py-2">
              <DateComponent dateString={date} />
            </Chip>
          ) : null}
        </div>
      </div>
    </div>
  )
}
