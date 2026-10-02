import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import {dataAttr} from '@/sanity/lib/utils'

import PostMarqueeRow from './PostMarqueeRow'

type AdjacentPost = {
  _id: string
  title: string
  slug: string
}

export default function AdjacentPosts({
  previous,
  next,
}: {
  previous: AdjacentPost | null
  next: AdjacentPost | null
}) {
  if (!previous && !next) {
    return null
  }

  return (
    <div className="border-t-site border-black dark:border-white">
      <h2 className="flex items-center gap-5 p-5 pb-0 text-lg font-semibold uppercase lg:p-10 lg:pb-0">
        <span className="block h-4 w-4 bg-black dark:bg-white" />
        More articles
      </h2>
      {previous ? (
        <PostMarqueeRow
          href={`/blog/${previous.slug}`}
          label="Previous"
          title={previous.title}
          sanity={dataAttr({id: previous._id, type: 'post', path: 'title'}).toString()}
        />
      ) : null}
      {next ? (
        <PostMarqueeRow
          href={`/blog/${next.slug}`}
          label="Next"
          title={next.title}
          index={1}
          sanity={dataAttr({id: next._id, type: 'post', path: 'title'}).toString()}
        />
      ) : null}
    </div>
  )
}
