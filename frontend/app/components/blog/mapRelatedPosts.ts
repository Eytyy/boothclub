import type {RelatedPostItem} from '@/app/components/blog/RelatedPosts'
import type {RelatedPostsQueryResult} from '@/sanity.types'

export function mapRelatedPosts(
  posts: RelatedPostsQueryResult | null | undefined,
): RelatedPostItem[] {
  return (posts ?? []).flatMap((post) => {
    if (!post.title || !post.slug) {
      return []
    }

    return [
      {
        _id: post._id,
        title: post.title,
        href: `/blog/${post.slug}`,
      },
    ]
  })
}
