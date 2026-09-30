import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/ui/Date'
import Image from '@/app/components/ui/SanityImage.client'
import {dataAttr} from '@/sanity/lib/utils'

export const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, date, coverImage} = post

  if (!title || !slug) {
    return null
  }

  return (
    <article
      data-sanity={dataAttr({id: _id, type: 'post', path: 'title'}).toString()}
      key={_id}
      className="rounded-sm flex flex-col justify-start transition-colors relative"
    >
      <LocalizedLink className="underline transition-colors" href={`/blog/${slug}`}>
        <span className="absolute inset-0 z-10" />
      </LocalizedLink>
      {coverImage?.asset?._ref ? (
        <div className="mb-4 overflow-hidden rounded-t-sm">
          <Image
            id={coverImage.asset?._ref || ''}
            alt={coverImage.alt || ''}
            className="w-full object-cover aspect-square"
            width={600}
            height={600}
            mode="cover"
            hotspot={coverImage.hotspot}
            crop={coverImage.crop}
            preview={(coverImage as {lqip?: string | null}).lqip ?? undefined}
          />
        </div>
      ) : (
        <div className="mb-4 overflow-hidden rounded-t-sm">
          <div className="w-full object-cover aspect-square bg-gray-200" />
        </div>
      )}
      <div>
        <time className="text-black/50 dark:text-white/50 text-xs" dateTime={date}>
          <DateComponent dateString={date} />
        </time>
        <h3 className="lg:text-2xl">{title}</h3>
      </div>
    </article>
  )
}
