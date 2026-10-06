'use client'
import MuxPlayer, {type MuxCSSProperties} from '@mux/mux-player-react'
import {stegaClean} from '@sanity/client/stega'
import type {PortableTextBlock} from 'next-sanity'

import {GridContainer} from '@/app/components/ui/GridSystem'
import CustomPortableText from '@/app/components/ui/PortableText'
import Image from '@/app/components/ui/SanityImage.client'
import type {HomePageQueryResult} from '@/sanity.types'

type HeroColumn = NonNullable<NonNullable<HomePageQueryResult>['hero']>['columns'][number]
type HeroItem = HeroColumn['items'][number]

/**
 * Motion presets, applied to the columns in order.
 * `secondsPerItem` is roughly how long one tile takes to travel its own height. Lower is faster.
 * `offset` is how far up the column sits, as a fraction of one tile, so the columns
 * don't share an edge before the loop starts.
 */
const COLUMN_MOTION = [
  {secondsPerItem: 10, offset: 0.22},
  {secondsPerItem: 16, offset: 0.7},
  {secondsPerItem: 7, offset: 0.41},
]

const VISIBLE_ROWS = 2
/** First rows that can sit in the window once a column is offset. */
const ENTER_ROWS = VISIBLE_ROWS + 1
const CARD_STAGGER = 0.1
const CARD_ENTER = 0.55
const SCROLL_HOLD = 0.25

/** Scroll starts once the last entering card has landed, plus a short hold. */
const scrollDelay =
  (ENTER_ROWS * COLUMN_MOTION.length - 1) * CARD_STAGGER + CARD_ENTER + SCROLL_HOLD

export default function HomeHero({columns}: {columns: HeroColumn[]}) {
  if (!columns.length) return null

  return (
    <GridContainer
      columns={[4, 4, 4]}
      className="grid grid-cols-3 border-x-0 p-0 lg:p-0 mx-0 lg:mx-0"
    >
      {columns.map((column, index) => (
        <ScrollingColumn
          key={column._key}
          columnIndex={index}
          items={column.items ?? []}
          {...COLUMN_MOTION[index % COLUMN_MOTION.length]}
        />
      ))}
    </GridContainer>
  )
}

function ScrollingColumn({
  columnIndex,
  secondsPerItem,
  offset,
  items,
}: {
  columnIndex: number
  secondsPerItem: number
  offset: number
  items: HeroItem[]
}) {
  if (!items.length) return <div className="p-10" />

  // Repeat short columns so the window never shows a gap, then double for the seamless loop.
  // Text tiles size to their content and can be shorter than a square, so ask for more of them.
  const hasText = items.some((item) => item._type === 'block.text')
  const minItems = hasText ? ENTER_ROWS * 2 : ENTER_ROWS
  const repeats = Math.ceil(minItems / items.length)
  const base = Array.from({length: repeats}, () => items).flat()
  const loop = [...base, ...base]

  return (
    <div className="@container p-10">
      {/* Two tiles plus the gap between them. Extra tiles scroll through this window. */}
      <div className="overflow-hidden" style={{height: 'calc(200cqw + var(--spacing) * 10)'}}>
        <div
          style={{
            transform: `translate3d(0, calc((100cqw + var(--spacing) * 10) * ${-offset}), 0)`,
          }}
        >
          <div
            className="hero-column-track flex flex-col"
            style={{
              ['--hero-column-duration' as string]: `${base.length * secondsPerItem}s`,
              ['--hero-scroll-delay' as string]: `${scrollDelay}s`,
            }}
          >
            {loop.map((item, index) => {
              const enters = index < ENTER_ROWS
              return (
                <div
                  key={`${item._key}-${index}`}
                  className="pb-10"
                  aria-hidden={index >= items.length}
                >
                  <div
                    className={enters ? 'hero-card-enter' : undefined}
                    style={
                      enters
                        ? {
                            ['--hero-card-duration' as string]: `${CARD_ENTER}s`,
                            ['--hero-card-delay' as string]: `${(index * COLUMN_MOTION.length + columnIndex) * CARD_STAGGER}s`,
                          }
                        : undefined
                    }
                  >
                    <HeroTile item={item} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroTile({item}: {item: HeroItem}) {
  if (item._type === 'block.text') {
    return (
      <div className="w-full bg-black text-white">
        <HeroText content={item.content} />
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-black text-white">
      <HeroMedia item={item} />
    </div>
  )
}

function HeroText({content}: {content: Extract<HeroItem, {_type: 'block.text'}>['content']}) {
  if (!content?.length) return null

  return (
    <div className="p-6 text-2xl font-semibold lg:text-3xl">
      <CustomPortableText value={content as PortableTextBlock[]} invert={false} />
    </div>
  )
}

function HeroMedia({item}: {item: Extract<HeroItem, {_type: 'block.media'}>}) {
  if (stegaClean(item.type) === 'video') {
    const playbackId = item.video?.muxVideo?.playbackId
    if (!playbackId) return null

    return (
      <MuxPlayer
        playbackId={playbackId}
        autoPlay="muted"
        muted
        loop
        playsInline
        className="h-full w-full"
        style={
          {
            '--controls': 'none',
            '--media-object-fit': 'cover',
            '--media-object-position': 'center',
          } as MuxCSSProperties
        }
      />
    )
  }

  const image = item.image
  if (!image?.asset?._ref) return null

  return (
    <Image
      id={image.asset._ref}
      alt={image.alt ?? ''}
      width={800}
      height={800}
      mode="cover"
      hotspot={image.hotspot}
      crop={image.crop}
      preview={image.lqip ?? undefined}
      className="h-full w-full object-cover"
    />
  )
}
