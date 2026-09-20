import ProjectHeroVideo from '@/app/components/project/ProjectHeroVideo.client'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import {PortableTextBlock} from 'next-sanity'

type ProductMainMediaProps = {
  title: string
  mainImage?: any
  heroPlaybackId?: string | null
  className?: string
}

export function ProductMainMedia({
  title,
  mainImage,
  heroPlaybackId,
  className,
}: ProductMainMediaProps) {
  return (
    <div className={cn(className)}>
      {heroPlaybackId ? (
        <ProjectHeroVideo playbackId={heroPlaybackId} title={title} />
      ) : mainImage?.asset?._ref ? (
        <Image
          className="h-full w-full  object-cover"
          id={mainImage.asset._ref}
          alt=""
          aria-hidden="true"
          width={1200}
          height={1600}
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
