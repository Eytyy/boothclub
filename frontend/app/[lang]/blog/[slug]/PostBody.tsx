import {stegaClean} from '@sanity/client/stega'

import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import PortableText from '@/app/components/ui/PortableText'
import {cn} from '@/app/lib/utils'
import type {PostQueryResult} from '@/sanity.types'
import {toPortableTextBlocks} from '@/sanity/lib/utils'

type PostSection = NonNullable<PostQueryResult>['sections'][number]
type PostSectionBlock = NonNullable<PostSection['blocks']>[number]

function sectionGridClass(columns: PostSection['columns']): string {
  const value = stegaClean(columns)
  if (value === '2') return 'grid-cols-2'
  if (value === '3') return 'grid-cols-3'
  return 'grid-cols-1'
}

function blockColSpan(columns: PostSection['columns'], span: PostSectionBlock['span']): string {
  const cols = stegaClean(columns)
  const width = stegaClean(span) ?? '1'

  if (cols === '1') return 'col-span-1'
  if (cols === '2') {
    if (width === '2' || width === 'full') return 'col-span-2'
    return 'col-span-1'
  }
  if (width === 'full') return 'col-span-3'
  if (width === '2') return 'col-span-2'
  return 'col-span-1'
}

function PostSectionBlockView({
  block,
  columns,
}: {
  block: PostSectionBlock
  columns: PostSection['columns']
}) {
  const colSpan = blockColSpan(columns, block.span)

  if (block._type === 'post.content') {
    const value = toPortableTextBlocks(block.content)
    if (!value.length) return null
    return (
      <div className={colSpan}>
        <PortableText
          className="max-w-full prose-headings:font-medium prose-headings:tracking-tight text-lg"
          value={value}
        />
      </div>
    )
  }

  return (
    <div className={colSpan}>
      <MediaItem media={block.media} />
    </div>
  )
}

export default function PostBody({sections}: {sections: PostSection[]}) {
  if (!sections.length) return null

  return (
    <div className="grid gap-y-[60px]">
      {sections.map((section) => (
        <div
          key={section._key}
          className={cn('grid gap-x-[40px] gap-y-[40px]', sectionGridClass(section.columns))}
        >
          {(section.blocks ?? []).map((block) => (
            <PostSectionBlockView key={block._key} block={block} columns={section.columns} />
          ))}
        </div>
      ))}
    </div>
  )
}
