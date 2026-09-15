import PortableText from '@/app/components/ui/PortableText'
import {ExtractPageBuilderType} from '@/sanity/lib/types'
import {toPortableTextBlocks} from '@/sanity/lib/utils'

type InfoProps = {
  block: ExtractPageBuilderType<'block.text'>
  index: number
  pageId: string
  pageType: string
}

export default function InfoSection({block}: InfoProps) {
  const isTwoColumn = block.layout === 'twoColumn'
  const blocks = toPortableTextBlocks(block.content)

  return (
    <div className="container my-10 lg:my-20">
      <div className={isTwoColumn ? 'w-full' : 'max-w-3xl'}>
        {blocks.length > 0 && (
          <PortableText
            className={isTwoColumn ? '2xl:columns-2 2xl:max-w-[130ch] mx-auto 2xl:gap-10' : ''}
            value={blocks}
          />
        )}
      </div>
    </div>
  )
}
