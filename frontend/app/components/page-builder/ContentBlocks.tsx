import ContentSectionBlock from './blocks/ContentSectionBlock'
import FullMediaBlock from './blocks/FullMediaBlock'
import SplitMediaBlock from './blocks/SplitMediaBlock'
import type {ContentBlocksProp} from './types'

export default function ContentBlocks({blocks}: {blocks: ContentBlocksProp | null | undefined}) {
  if (!blocks?.length) return null

  return (
    <div className="grid gap-5">
      {blocks.map((block) => {
        const key = block._key

        if (block._type === 'block.contentSection') {
          return <ContentSectionBlock key={key} headline={block.headline} text={block.text} />
        }

        if (block._type === 'block.media') {
          return <FullMediaBlock key={key} media={block} />
        }

        if (block._type === 'block.splitMedia') {
          return <SplitMediaBlock key={key} left={block.left} right={block.right} />
        }

        return null
      })}
    </div>
  )
}
