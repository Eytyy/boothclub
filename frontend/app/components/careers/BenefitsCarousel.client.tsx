'use client'

import DotCarousel from '@/app/components/ui/DotCarousel.client'
import type {CareersPageQueryResult} from '@/sanity.types'
import BigText from '../ui/BigText'
import SplitLines from '../ui/SplitLines'

type Benefit = NonNullable<NonNullable<CareersPageQueryResult>['benefits']>[number]

type BenefitsCarouselProps = {
  benefits: Benefit[] | null | undefined
}

function BenefitCard({headline, description}: Benefit & {headline: string}) {
  return (
    <div className="max-w-3xl flex flex-col gap-4 text-center">
      <BigText as="h2" className="px-0 lg:px-0">
        <SplitLines text={headline} />
      </BigText>
      {description ? (
        <p className="text-base leading-relaxed text-black/80 dark:text-white/80">{description}</p>
      ) : null}
    </div>
  )
}

export default function BenefitsCarousel({benefits}: BenefitsCarouselProps) {
  const list =
    benefits?.filter((b): b is Benefit & {headline: string} => Boolean(b?.headline)) ?? []
  if (!list.length) return null

  return (
    <section className="mb-20 lg:py-20 container" aria-label="Benefits">
      <DotCarousel className="pt-4" dotsClassName="mt-6">
        {list.map((b, i) => (
          <BenefitCard key={`${b.headline}-${i}`} {...b} />
        ))}
      </DotCarousel>
    </section>
  )
}
