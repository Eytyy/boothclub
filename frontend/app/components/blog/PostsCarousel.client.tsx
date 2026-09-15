'use client'

import type {ReactNode} from 'react'

import {Post} from '@/app/[lang]/blog/Post'
import CardsCarousel from '@/app/components/ui/CardsCarousel.client'
import type {AllPostsQueryResult} from '@/sanity.types'

type PostsCarouselProps = {
  items: AllPostsQueryResult
  header?: ReactNode
  cta?: ReactNode
  cardClassName?: string
  className?: string
}

export default function PostsCarousel({
  items,
  header,
  cta,
  cardClassName,
  className,
}: PostsCarouselProps) {
  return (
    <CardsCarousel
      items={items}
      renderItem={(post) => <Post post={post} />}
      header={header}
      cta={cta}
      className={className}
      cardClassName={cardClassName}
    />
  )
}
