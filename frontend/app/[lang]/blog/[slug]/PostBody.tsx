import {stegaClean} from '@sanity/client/stega'

import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import PortableText from '@/app/components/ui/PortableText'
import type {PostQueryResult} from '@/sanity.types'
import {toPortableTextBlocks} from '@/sanity/lib/utils'
import {cn} from '@/app/lib/utils'

type PostSection = NonNullable<PostQueryResult>['sections'][number]
type PostSectionBlock = NonNullable<PostSection['blocks']>[number]
type PostContentBlock = Extract<PostSectionBlock, {_type: 'post.content'}>
type PostMediaBlock = Extract<PostSectionBlock, {_type: 'post.media'}>

function isContentBlock(block: PostSectionBlock): block is PostContentBlock {
  return block._type === 'post.content'
}

function isMediaBlock(block: PostSectionBlock): block is PostMediaBlock {
  return block._type === 'post.media'
}

function hasRenderableContent(block: PostContentBlock): boolean {
  return toPortableTextBlocks(block.content).length > 0
}

function renderableBlocks(blocks: PostSectionBlock[] | null | undefined): PostSectionBlock[] {
  return (blocks ?? []).filter((block) => {
    if (isContentBlock(block)) return hasRenderableContent(block)
    return isMediaBlock(block)
  })
}

function sectionGridClass(columns: PostSection['columns']): string {
  const cols = stegaClean(columns)
  if (cols === '2') return 'grid-cols-2'
  if (cols === '3') return 'grid-cols-3'
  return 'grid-cols-1'
}

function getBlockSpanClass(
  span: PostSectionBlock['span'],
  columns: PostSection['columns'],
): string {
  const cols = stegaClean(columns)
  const width = stegaClean(span) ?? '1'

  if (cols === '1') return 'col-span-full'
  if (cols === '2') {
    if (width === '2' || width === 'full') return 'col-span-2'
    return 'col-span-1'
  }
  if (width === 'full') return 'col-span-3'
  if (width === '2') return 'col-span-2'
  return 'col-span-1'
}

export default function PostBody({sections}: {sections: PostSection[]}) {
  const visible = sections.filter((section) => renderableBlocks(section.blocks).length > 0)
  if (!visible.length) return null

  return visible.map((section) => (
    <div key={section._key} className={cn('grid gap-10', sectionGridClass(section.columns))}>
      {renderableBlocks(section.blocks).map((block) => (
        <div key={block._key} className={getBlockSpanClass(block.span, section.columns)}>
          {isContentBlock(block) ? (
            <PortableText
              className="max-w-[1000px] mx-auto body-text"
              value={toPortableTextBlocks(block.content)}
            />
          ) : isMediaBlock(block) ? (
            <MediaItem media={block.media} />
          ) : null}
        </div>
      ))}
    </div>
  ))
}
