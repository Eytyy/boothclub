'use client'

import MuxPlayer from '@mux/mux-player-react'
import {stegaClean} from '@sanity/client/stega'

import Image from '@/app/components/ui/SanityImage.client'

/** GROQ-expanded `block.video` nested inside `block.media`. */
export type VideoBlockData = {
  _type?: string
  muxVideo?: {playbackId?: string | null; assetId?: string | null; filename?: string | null} | null
}

export type MediaBlockData = {
  type?: string | null
  image?: {
    asset?: {_ref?: string | null} | null
    alt?: string | null
    credits?: string | null
    hotspot?: unknown
    crop?: unknown
    lqip?: string | null
  } | null
  video?: VideoBlockData | null
}

export type MediaAspect = 'video' | 'square' | 'original'

const ASPECT_CONFIG: Record<MediaAspect, {className: string; width: number; height?: number}> = {
  video: {className: 'aspect-video', width: 1600, height: 900},
  square: {className: 'aspect-square', width: 1600, height: 1600},
  original: {className: 'aspect-original', width: 1600},
}

export default function MediaItem({
  media,
  aspect,
}: {
  media: MediaBlockData | null | undefined
  aspect?: MediaAspect
}) {
  if (!media) return null

  const kind = stegaClean(media.type) ?? 'image'
  const {className: aspectClass, width, height} = ASPECT_CONFIG[aspect ?? 'original']

  if (kind === 'video') {
    const playbackId = media.video?.muxVideo?.playbackId
    if (!playbackId) return null

    return (
      <div className="w-full">
        <div className={`w-full  ${aspectClass}`}>
          <MuxPlayer playbackId={playbackId} className="h-full w-full" accentColor="#000" />
        </div>
      </div>
    )
  }

  const img = media.image
  if (!img?.asset?._ref) return null

  return (
    <figure className="w-full">
      <div className={`w-full  ${aspectClass}`}>
        <Image
          id={img.asset._ref}
          alt={img.alt ?? ''}
          hotspot={img.hotspot as {x: number; y: number} | undefined}
          crop={img.crop as {top: number; bottom: number; left: number; right: number} | undefined}
          preview={img.lqip ?? undefined}
          width={width}
          height={height ?? undefined}
          className="h-full w-full object-cover"
          mode="cover"
        />
      </div>
      {img.credits ? (
        <figcaption className="mt-2 text-sm text-black/50 dark:text-white/50">
          {img.credits}
        </figcaption>
      ) : null}
    </figure>
  )
}
