'use client'

import type {ReactNode} from 'react'
import useEmblaCarousel from 'embla-carousel-react'

import type {AllPostsQueryResult} from '@/sanity.types'
import {Post} from '@/app/[lang]/blog/Post'

type Props = {
  posts: AllPostsQueryResult
  cta?: ReactNode
}

export default function FeaturedBlogPostsCarousel({posts, cta}: Props) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  if (!posts?.length) return null

  return (
    <section className="lg:hidden flex flex-col gap-10 pb-10">
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className="flex gap-10 px-5 lg:px-10">
          {posts.map((post) => (
            <div
              key={post._id}
              className="shrink-0 w-[calc(100%-3.5rem)] sm:w-[calc((100%-1.75rem)/1.5)] md:w-[calc((100%-5rem)/1.5)]"
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
      {cta ? <div className="flex justify-center px-5">{cta}</div> : null}
    </section>
  )
}
