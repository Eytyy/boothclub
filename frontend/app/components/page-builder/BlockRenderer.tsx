import React from 'react'

import CtaBlock from './blocks/CtaBlock'
import Info from './blocks/InfoSection'
import ImageBlock from './blocks/ImageBlock'
import VideoBlock from './blocks/VideoBlock.client'
import Stats from './blocks/Stats.client'
import FullMediaBlock from './blocks/FullMediaBlock'
import ContentSectionBlock from './blocks/ContentSectionBlock'
import Team from './blocks/Team'

import {dataAttr} from '@/sanity/lib/utils'
import {ExtractPageBuilderType, PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

function PageBuilderFullMedia({block}: BlockProps) {
  return <FullMediaBlock media={block as ExtractPageBuilderType<'block.media'>} />
}

function PageBuilderContentSection({block}: BlockProps) {
  const {headline, text} = block as ExtractPageBuilderType<'block.contentSection'>
  return <ContentSectionBlock headline={headline} text={text} />
}

const Blocks = {
  cta: CtaBlock,
  ['block.text']: Info,
  ['block.image']: ImageBlock,
  ['block.video']: VideoBlock,
  ['block.media']: PageBuilderFullMedia,
  ['block.contentSection']: PageBuilderContentSection,
  stats: Stats,
  team: Team,
} as BlocksType

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          pageId: pageId,
          pageType: pageType,
        })}
      </div>
    )
  }
  return React.createElement(
    () => (
      <div className="w-full bg-black/10 dark:bg-white/10 text-center text-black/50 dark:text-white/50 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
