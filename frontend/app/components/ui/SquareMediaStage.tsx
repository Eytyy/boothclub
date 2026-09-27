import type {ReactNode} from 'react'

import Image from '@/app/components/ui/SanityImage.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'

export type SpotlightImage = {
  asset?: {_ref?: string | null} | null
  alt?: string | null
  hotspot?: {x?: number; y?: number} | null
  crop?: {top?: number; bottom?: number; left?: number; right?: number} | null
  lqip?: string | null
} | null

type SquareMediaStageProps = {
  href: string
  label: string
  image?: SpotlightImage
  children?: ReactNode
}

export default function SquareMediaStage({href, label, image, children}: SquareMediaStageProps) {
  const imageRef = image?.asset?._ref

  return (
    <div className="relative flex aspect-square w-full items-center justify-center">
      <LocalizedLink href={href} aria-label={label} className="absolute inset-0" />
      <div className="pointer-events-none relative z-10 w-4/5 overflow-hidden">
        {imageRef && image ? (
          <div className="relative">
            <Image
              id={imageRef}
              alt={image.alt || ''}
              className="aspect-square w-full object-cover"
              width={600}
              height={600}
              mode="cover"
              hotspot={image.hotspot ?? undefined}
              crop={image.crop ?? undefined}
              preview={image.lqip ?? undefined}
            />
            {children}
          </div>
        ) : (
          <div className="aspect-square w-full bg-black/5 dark:bg-white/5" />
        )}
      </div>
    </div>
  )
}
