import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import SectionHeading from '@/app/components/ui/SectionHeading'

import PostMarqueeRow from '@/app/components/blog/PostMarqueeRow'

export type TaggedKind = 'product' | 'productCategory' | 'project'

export type TaggedLink = {
  id: string
  kind: TaggedKind
  title: string
  href: string
}

const taggedLabels: Record<TaggedKind, string> = {
  product: 'Product',
  productCategory: 'Category',
  project: 'Project',
}

export default function TaggedInArticle({items}: {items: TaggedLink[]}) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="border-t-site border-black dark:border-white">
      <SectionHeading>Tagged in this article</SectionHeading>
      {items.map((item, index) => (
        <PostMarqueeRow
          key={item.id}
          href={item.href}
          label={taggedLabels[item.kind]}
          title={item.title}
          index={index}
        />
      ))}
    </div>
  )
}
