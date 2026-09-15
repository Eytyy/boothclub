'use client'

import PageTitle from '../ui/PageTitle'
import JobOpening from './JobOpening.client'
import type {CareersPageQueryResult} from '@/sanity.types'

type Job = NonNullable<NonNullable<CareersPageQueryResult>['jobOpenings']>[number]

type JobOpeningsProps = {
  openings: Job[] | null | undefined
  applyEmail: string | null | undefined
}

export default function JobOpenings({openings, applyEmail}: JobOpeningsProps) {
  const list = openings?.filter((opening): opening is Job => Boolean(opening?._id && opening.title)) ?? []
  if (!list.length) return null
  if (!applyEmail) return null

  return (
    <section className="lg:py-12 lg:px-10 lg:flex lg:flex-col lg:gap-10" aria-label="Job openings">
      <PageTitle as="h2">Job openings</PageTitle>
      <div className="container">
        {list.map((opening) => (
          <JobOpening key={opening._id} opening={opening} applyEmail={applyEmail} />
        ))}
      </div>
    </section>
  )
}
