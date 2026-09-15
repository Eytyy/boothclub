import Image from '@/app/components/ui/SanityImage.client'
import {ExtractPageBuilderType} from '@/sanity/lib/types'

type ImageBlockProps = {
  block: ExtractPageBuilderType<'block.image'>
  index: number
  pageId: string
  pageType: string
}

export default function ImageBlock({block}: ImageBlockProps) {
  if (!block?.asset?._ref) return null

  return (
    <div className="container my-12">
      <figure>
        <Image
          id={block.asset._ref}
          alt={block.alt ?? ''}
          hotspot={block.hotspot}
          crop={block.crop}
          preview={block.lqip ?? undefined}
          width={1200}
          className="w-full rounded-sm"
        />
        {block.credits && (
          <figcaption className="mt-2 text-sm text-black/50 dark:text-white/50">{block.credits}</figcaption>
        )}
      </figure>
    </div>
  )
}
