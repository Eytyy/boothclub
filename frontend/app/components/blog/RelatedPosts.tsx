import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {Marquee} from '@/app/components/ui/Marquee.client'
import {cn} from '@/app/lib/utils'

export type RelatedPostItem = {
  _id: string
  title: string
  href: string
}

export default function RelatedPosts({posts}: {posts: RelatedPostItem[]}) {
  if (posts.length === 0) {
    return null
  }

  return (
    <div>
      {posts.map((post, index) => (
        <article
          key={post._id}
          className="relative border-b-site border-black dark:border-white last:border-b-0"
        >
          <LocalizedLink href={post.href}>
            <span className="absolute inset-0 z-10" />
            <span className="sr-only">{post.title}</span>
          </LocalizedLink>
          <Marquee speed={100 + index * 2} runClassName="mx-0" className="h-auto">
            <span
              className={cn(
                'tracking-normal uppercase page-title',
                'inline-block whitespace-nowrap px-10 py-5 ',
              )}
            >
              {post.title}
            </span>
          </Marquee>
        </article>
      ))}
    </div>
  )
}
