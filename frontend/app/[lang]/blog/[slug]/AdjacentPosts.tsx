import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import SectionHeading from '@/app/components/ui/SectionHeading'
import {dataAttr} from '@/sanity/lib/utils'

import PostMarqueeRow from '@/app/components/blog/PostMarqueeRow'

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
      <SectionHeading>More articles</SectionHeading>
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
