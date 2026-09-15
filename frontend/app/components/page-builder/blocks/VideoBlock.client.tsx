'use client'

import MuxPlayer from '@mux/mux-player-react'
import {ExtractPageBuilderType} from '@/sanity/lib/types'

type VideoBlockProps = {
  block: ExtractPageBuilderType<'block.video'>
  index: number
  pageId: string
  pageType: string
}

export default function VideoBlock({block}: VideoBlockProps) {
  const playbackId = block.muxVideo?.playbackId
  if (!playbackId) return null

  return (
    <div className="container my-12">
      <div className="aspect-video overflow-hidden rounded-sm">
        <MuxPlayer playbackId={playbackId} className="h-full w-full" accentColor="#000" />
      </div>
    </div>
  )
}
