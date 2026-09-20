'use client'

import CardsCarousel from '@/app/components/ui/CardsCarousel.client'
import type {ProjectCardData} from '@/app/components/project/types'
import {cn} from '@/app/lib/utils'

import ProductCard from '../ProductCard'
import Button from '@/app/components/ui/Button'

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous project' : 'Next project'}
      className={cn(
        'pointer-events-auto absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center text-black dark:text-white disabled:pointer-events-none disabled:opacity-30',
        direction === 'prev' ? 'start-0' : 'end-0',
      )}
    >
      <span
        className={cn(
          'block size-8 border-8 border-current border-t-0 border-r-0 rtl:-scale-x-100',
          direction === 'prev' ? 'rotate-45 -translate-x-0.5' : '-rotate-135 translate-x-0.5',
        )}
        aria-hidden
      />
    </button>
  )
}

export default function FeaturedProjects({
  items,
  className,
}: {
  items: ProjectCardData[]
  className?: string
}) {
  const showArrows = items.length > 1

  return (
    <div className="border-b-4 border-black dark:border-white">
      <CardsCarousel
        variant="single"
        items={items}
        className={cn('relative p-0 px-20', className)}
        renderItem={(item) => (
          <ProductCard
            href={`/projects/${item.slug}`}
            title={item.title}
            image={item.mainImage}
            className="border-b-0 pb-5 px-10"
          />
        )}
        controls={({scrollPrev, scrollNext, canScrollPrev, canScrollNext}) =>
          showArrows ? (
            <div className="pointer-events-none absolute inset-10">
              <CarouselArrow direction="prev" onClick={scrollPrev} disabled={!canScrollPrev} />
              <CarouselArrow direction="next" onClick={scrollNext} disabled={!canScrollNext} />
            </div>
          ) : null
        }
      />
      <div className="flex justify-end">
        <Button href="/projects" className="uppercase">
          All Projects &rarr;
        </Button>
      </div>
    </div>
  )
}
