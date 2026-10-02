import {GridColumn, GridContainer} from '@/app/components/ui/GridSystem'

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
      <h2 className="flex items-center gap-5 p-5 pb-0 text-lg font-semibold uppercase lg:p-10 lg:pb-0">
        <span className="block h-4 w-4 bg-black dark:bg-white" />
        Tagged in this article
      </h2>
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
