import type {ReactNode} from 'react'
import {stegaClean} from '@sanity/client/stega'

import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import {GridBlock, GridColumn, GridContainer} from '@/app/components/ui/GridSystem'
import PortableText from '@/app/components/ui/PortableText'
import {cn} from '@/app/lib/utils'
import type {PostQueryResult} from '@/sanity.types'
import {toPortableTextBlocks} from '@/sanity/lib/utils'

type PostSection = NonNullable<PostQueryResult>['sections'][number]
type PostSectionBlock = NonNullable<PostSection['blocks']>[number]
type PostContentBlock = Extract<PostSectionBlock, {_type: 'post.content'}>
type PostMediaBlock = Extract<PostSectionBlock, {_type: 'post.media'}>

type BlockGroup =
  | {type: 'content'; blocks: PostContentBlock[]}
  | {type: 'media'; blocks: PostMediaBlock[]}

function isContentBlock(block: PostSectionBlock): block is PostContentBlock {
  return block._type === 'post.content'
}

function isMediaBlock(block: PostSectionBlock): block is PostMediaBlock {
  return block._type === 'post.media'
}

function hasRenderableContent(block: PostContentBlock): boolean {
  return toPortableTextBlocks(block.content).length > 0
}

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

function mediaGridSpan(
  columns: PostSection['columns'],
  span: PostSectionBlock['span'],
): 'full' | 4 | 6 | 8 {
  const cols = stegaClean(columns)
  const width = stegaClean(span) ?? '1'

  if (cols === '1') return 'full'
  if (cols === '2') {
    if (width === '2' || width === 'full') return 'full'
    return 6
  }
  if (width === 'full') return 'full'
  if (width === '2') return 8
  return 4
}

function groupConsecutiveBlocks(blocks: PostSectionBlock[]): BlockGroup[] {
  const groups: BlockGroup[] = []

  for (const block of blocks) {
    if (isContentBlock(block)) {
      if (!hasRenderableContent(block)) continue
      const last = groups[groups.length - 1]
      if (last?.type === 'content') {
        last.blocks.push(block)
      } else {
        groups.push({type: 'content', blocks: [block]})
      }
      continue
    }

    if (!isMediaBlock(block)) continue

    const last = groups[groups.length - 1]
    if (last?.type === 'media') {
      last.blocks.push(block)
    } else {
      groups.push({type: 'media', blocks: [block]})
    }
  }

  return groups
}

function ContentBlockView({
  block,
  columns,
}: {
  block: PostContentBlock
  columns: PostSection['columns']
}) {
  const value = toPortableTextBlocks(block.content)
  if (!value.length) return null

  return (
    <div className={blockColSpan(columns, block.span)}>
      <PortableText
        className="max-w-full prose-headings:font-medium prose-headings:tracking-tight text-lg"
        value={value}
      />
    </div>
  )
}

function ContentWell({children}: {children: ReactNode}) {
  return (
    <GridColumn span={8} className="lg:col-start-3">
      <GridBlock>{children}</GridBlock>
    </GridColumn>
  )
}

export default function PostBody({sections}: {sections: PostSection[]}) {
  if (!sections.length) return null

  return (
    <GridContainer columns="none" className="gap-10">
      {sections.map((section) => {
        const groups = groupConsecutiveBlocks(section.blocks ?? [])
        if (!groups.length) return null

        return (
          <GridColumn span="full" className="grid grid-cols-12 gap-10" key={section._key}>
            {groups.flatMap((group, index) => {
              if (group.type === 'content') {
                return [
                  <ContentWell key={`${section._key}-content-${index}`}>
                    <div
                      className={cn(
                        'grid gap-x-10 gap-y-10',
                        sectionGridClass(section.columns),
                      )}
                    >
                      {group.blocks.map((block) => (
                        <ContentBlockView
                          key={block._key}
                          block={block}
                          columns={section.columns}
                        />
                      ))}
                    </div>
                  </ContentWell>,
                ]
              }

              return [
                <GridColumn
                  key={`${section._key}-media-${index}`}
                  span="full"
                  className="grid grid-cols-12 gap-10 px-10"
                >
                  {group.blocks.map((block) => (
                    <GridColumn key={block._key} span={mediaGridSpan(section.columns, block.span)}>
                      <MediaItem media={block.media} />
                    </GridColumn>
                  ))}
                </GridColumn>,
              ]
            })}
          </GridColumn>
        )
      })}
    </GridContainer>
  )
}
