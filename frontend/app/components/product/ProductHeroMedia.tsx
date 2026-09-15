import type {PortableTextBlock} from 'next-sanity'

import Image from '@/app/components/ui/SanityImage.client'
import ProjectHeroVideo from '@/app/components/project/ProjectHeroVideo.client'
import type {ProductCardImage} from '@/app/components/product/types'

type ProductHeroMediaProps = {
  title: string
  description?: PortableTextBlock[] | null
  mainImage?: ProductCardImage
  heroPlaybackId?: string | null
}

export default function ProductHeroMedia({
  title,
  mainImage,
  heroPlaybackId,
}: ProductHeroMediaProps) {
  return (
    <div className="aspect-video lg:pb-5 px-5 lg:px-10">
      {heroPlaybackId ? (
        <ProjectHeroVideo playbackId={heroPlaybackId} title={title} />
      ) : mainImage?.asset?._ref ? (
        <Image
          className="h-full w-full rounded-sm object-cover"
          id={mainImage.asset._ref}
          alt=""
          aria-hidden="true"
          width={1200}
          height={675}
          mode="cover"
          hotspot={mainImage.hotspot}
          crop={mainImage.crop}
          preview={mainImage.lqip ?? undefined}
        />
      ) : (
        <div className="h-full w-full bg-black/5 dark:bg-white/5" />
      )}
    </div>
  )
}
