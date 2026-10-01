'use client'

import type {ReactNode} from 'react'

import CardsCarousel from '@/app/components/ui/CardsCarousel.client'
import {ProjectCard} from '@/app/components/project/ProjectCard'
import type {ProjectCardData} from '@/app/components/project/types'

type ProjectCarouselProps = {
  items: ProjectCardData[]
  header?: ReactNode
  cta?: ReactNode
  cardClassName?: string
  className?: string
}

export default function ProjectCarousel({
  items,
  header,
  cta,
  cardClassName,
  className,
}: ProjectCarouselProps) {
  return (
    <CardsCarousel
      items={items}
      renderItem={(item) => <ProjectCard item={item} />}
      cta={cta}
      className={className}
      cardClassName={cardClassName}
    />
  )
}
