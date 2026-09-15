'use client'

import {useId, useState} from 'react'

import CustomPortableText from '@/app/components/ui/PortableText'
import ArrowButton from '@/app/components/ui/ArrowButton'
import {cn} from '@/app/lib/utils'
import {toPortableTextBlocks} from '@/sanity/lib/utils'
import type {CareersPageQueryResult} from '@/sanity.types'

type Job = NonNullable<NonNullable<CareersPageQueryResult>['jobOpenings']>[number]

function employmentLabel(type: Job['employmentType']) {
  return type === 'full-time' ? 'Full time' : 'Part time'
}

type JobOpeningProps = {
  opening: Job
  applyEmail: string
}

export default function JobOpening({opening, applyEmail}: JobOpeningProps) {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()
  const {title, location, employmentType, description} = opening
  const blocks = toPortableTextBlocks(description)

  const subject = title ? `Application for ${title}` : 'Application'
  const mailtoHref = `mailto:${applyEmail}?subject=${encodeURIComponent(subject)}`
  const hasDescription = blocks.length > 0

  return (
    <article
      className="border-b border-black/10 py-8 last:border-b-0 dark:border-white/10"
      aria-labelledby={contentId}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_minmax(0,120px)] lg:items-baseline">
          <h2 id={contentId} className="text-lg font-semibold sm:col-span-1 2xl:text-2xl">
            {title}
          </h2>
          <p className="text-sm text-black/70 dark:text-white/70">{location}</p>
          <p className="text-sm uppercase tracking-wide text-black/60 dark:text-white/60">
            {employmentLabel(employmentType)}
          </p>
        </div>
        <div className="shrink-0 lg:pt-0.5">
          <ArrowButton href={mailtoHref} variant="primary">
            quick apply
          </ArrowButton>
        </div>
      </div>

      {hasDescription ? (
        <div className="mt-4">
          <div className={cn('overflow-hidden', !expanded && 'line-clamp-3')}>
            <CustomPortableText
              value={blocks}
              className="prose-sm max-w-none text-black/90 dark:prose-invert dark:text-white/90"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-2 text-sm font-medium text-black dark:text-white underline-offset-2 hover:underline"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        </div>
      ) : null}
    </article>
  )
}
