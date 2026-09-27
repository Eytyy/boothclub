import HeroVideo from '@/app/components/page/HeroVideo.client'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import type {PageImage} from './types'

type PageMainMediaProps = {
  title: string
  mainImage?: PageImage
  heroPlaybackId?: string | null
  className?: string
  aspect?: 'default' | 'landscape'
}

export function PageMainMedia({
  title,
  mainImage,
  heroPlaybackId,
  className,
  aspect = 'default',
}: PageMainMediaProps) {
  return (
    <div className={cn(className)}>
      {heroPlaybackId ? (
        <HeroVideo playbackId={heroPlaybackId} title={title} />
      ) : mainImage?.asset?._ref ? (
        <Image
          className="h-full w-full  object-cover"
          id={mainImage.asset._ref}
          alt=""
          aria-hidden="true"
          width={1400}
          height={aspect === 'landscape' ? 800 : 1560}
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
