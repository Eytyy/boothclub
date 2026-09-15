'use client'

import {useEffect, useRef, useState} from 'react'
import MuxPlayer, {type MuxCSSProperties} from '@mux/mux-player-react'
import type MuxPlayerElement from '@mux/mux-player'
import clsx from 'clsx'

type ProjectHeroVideoProps = {
  playbackId: string
  title?: string | null
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-10 w-10" aria-hidden="true">
      <path d="M8 5v14l11-7-11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10" aria-hidden="true">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  )
}

export default function ProjectHeroVideo({playbackId, title}: ProjectHeroVideoProps) {
  const playerRef = useRef<MuxPlayerElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPause)
    return () => {
      player.removeEventListener('play', onPlay)
      player.removeEventListener('pause', onPause)
    }
  }, [playbackId])

  const toggle = () => {
    const player = playerRef.current
    if (!player) return
    if (player.paused) {
      void player.play().catch(() => {})
    } else {
      player.pause()
    }
  }

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-sm">
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        muted
        playsInline
        loop
        accentColor="#000"
        metadata={{video_title: title ?? undefined}}
        className="h-full w-full"
        style={
          {
            '--controls': 'none',
            '--media-object-fit': 'cover',
            '--media-object-position': 'center',
          } as MuxCSSProperties
        }
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        className={clsx(
          'absolute top-1/2 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2',
          'items-center justify-center  bg-black/50 text-white backdrop-blur-sm',
          'pointer-events-auto transition-opacity duration-200',
          isPlaying
            ? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100'
            : 'opacity-100',
        )}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  )
}
