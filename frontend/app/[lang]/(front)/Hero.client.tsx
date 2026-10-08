'use client'
import {useEffect, useRef, type CSSProperties, type ReactNode, type RefObject} from 'react'
import MuxPlayer, {type MuxCSSProperties} from '@mux/mux-player-react'
import {stegaClean} from '@sanity/client/stega'

import Image from '@/app/components/ui/SanityImage.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'
import {productCategoryPath} from '@/app/lib/product/paths'
import {cn} from '@/app/lib/utils'
import type {HomePageQueryResult} from '@/sanity.types'

type HeroCategory = NonNullable<
  NonNullable<NonNullable<HomePageQueryResult>['hero']>['categories']
>[number]
type HeroItem = NonNullable<HeroCategory['media']>[number]

/**
 * Motion presets, applied to the columns (rows on mobile) in order.
 * `secondsPerItem` is roughly how long one tile takes to travel its own size. Lower is faster.
 * `offset` is how far the track is shifted, as a fraction of one tile, so neighbours
 * don't share an edge before the loop starts.
 */
const MOTION = [
  {secondsPerItem: 10, offset: 0.22},
  {secondsPerItem: 16, offset: 0.7},
  {secondsPerItem: 7, offset: 0.41},
]

const VISIBLE_TILES = 2
/** First tiles that can sit in the window once a track is offset. */
const ENTER_TILES = VISIBLE_TILES + 1
const CARD_STAGGER = 0.1
const CARD_ENTER = 0.55
const SCROLL_HOLD = 0.25

/** Scroll starts once the last entering card has landed, plus a short hold. */
const scrollDelay = (ENTER_TILES * MOTION.length - 1) * CARD_STAGGER + CARD_ENTER + SCROLL_HOLD

/** Row tile width on mobile, as a share of the hero width. Leaves the next tile peeking in. */
const ROW_TILE = '60cqw'

/** Matches Tailwind's `md` breakpoint, where the hero switches from rows to columns. */
const COLUMNS_QUERY = '(min-width: 48rem)'

/** Fixed classes so Tailwind sees them; one per supported column count. */
const GRID_COLS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

/**
 * One column per featured product category, each scrolling through the category's
 * home page media, with the category name linking through underneath.
 * Below `md` the columns become horizontal rows; from `md` up they scroll vertically.
 * Both layouts are rendered and CSS picks one, so the server HTML never flashes the
 * wrong layout. `--hero-gap` drives the padding and the loop maths at each size.
 */
export default function HomeHero({categories}: {categories: HeroCategory[]}) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Real video players only start once we know the column layout is the one on screen.
  const showColumns = useMediaQuery(COLUMNS_QUERY)

  usePauseWhenOffscreen(rootRef)

  if (!categories.length) return null

  return (
    <div
      ref={rootRef}
      className="[--hero-gap:calc(var(--spacing)*5)] lg:[--hero-gap:calc(var(--spacing)*10)]"
    >
      <div className="md:hidden">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="border-b-site border-black last:border-b-0 dark:border-white"
          >
            <div className="@container py-(--hero-gap)" dir="ltr">
              <ScrollingRow
                trackIndex={index}
                items={category.media ?? []}
                reverse={index % 2 === 1}
                {...MOTION[index % MOTION.length]}
              />
            </div>
            <CategoryLabel category={category} />
          </div>
        ))}
      </div>
      <div className={cn('hidden md:grid', GRID_COLS[categories.length] ?? 'md:grid-cols-3')}>
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="flex flex-col border-s-site border-black dark:border-white first:border-s-0"
          >
            <ScrollingColumn
              trackIndex={index}
              items={category.media ?? []}
              playVideo={showColumns}
              {...MOTION[index % MOTION.length]}
            />
            <CategoryLabel category={category} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Stops the scroll animations while the hero is out of view, to save battery. */
function usePauseWhenOffscreen(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      el.toggleAttribute('data-hero-offscreen', !entry.isIntersecting)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
}

/** Repeat short tracks so the window never shows a gap, then double for the seamless loop. */
function buildLoop(items: HeroItem[], minItems: number) {
  const repeats = Math.ceil(minItems / items.length)
  const base = Array.from({length: repeats}, () => items).flat()
  return {base, loop: [...base, ...base]}
}

type TrackProps = {
  trackIndex: number
  secondsPerItem: number
  offset: number
  items: HeroItem[]
}

function ScrollingColumn({
  trackIndex,
  secondsPerItem,
  offset,
  items,
  playVideo,
}: TrackProps & {playVideo: boolean}) {
  if (!items.length) return <div className="grow p-(--hero-gap)" />

  const {base, loop} = buildLoop(items, ENTER_TILES)

  return (
    <div className="@container grow p-(--hero-gap)">
      {/* Two tiles plus the gap between them. Extra tiles scroll through this window. */}
      <div className="overflow-hidden" style={{height: 'calc(200cqw + var(--hero-gap))'}}>
        <div
          style={{
            transform: `translate3d(0, calc((100cqw + var(--hero-gap)) * ${-offset}), 0)`,
          }}
        >
          <div
            className="hero-column-track flex flex-col"
            style={trackTiming(base.length * secondsPerItem)}
          >
            {loop.map((item, index) => (
              <div
                key={`${item._key}-${index}`}
                className="pb-(--hero-gap)"
                aria-hidden={index >= items.length}
              >
                <EnteringCard index={index} trackIndex={trackIndex}>
                  <SquareTile>
                    <HeroMedia item={item} playVideo={playVideo} />
                  </SquareTile>
                </EnteringCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScrollingRow({
  trackIndex,
  secondsPerItem,
  offset,
  items,
  reverse,
}: TrackProps & {reverse: boolean}) {
  if (!items.length) return null

  const {base, loop} = buildLoop(items, ENTER_TILES)
  const step = `(${ROW_TILE} + var(--hero-gap))`

  return (
    <div className="overflow-hidden">
      <div style={{transform: `translate3d(calc(${step} * ${-offset}), 0, 0)`}}>
        <div
          className={cn('hero-row-track flex w-max', reverse && 'hero-row-track--reverse')}
          style={trackTiming(base.length * secondsPerItem)}
        >
          {loop.map((item, index) => (
            <div
              key={`${item._key}-${index}`}
              className="shrink-0 pr-(--hero-gap)"
              style={{width: `calc${step}`}}
              aria-hidden={index >= items.length}
            >
              <EnteringCard index={index} trackIndex={trackIndex}>
                <SquareTile>
                  <HeroMedia item={item} playVideo={false} />
                </SquareTile>
              </EnteringCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function trackTiming(durationSeconds: number): CSSProperties {
  return {
    ['--hero-track-duration' as string]: `${durationSeconds}s`,
    ['--hero-scroll-delay' as string]: `${scrollDelay}s`,
  }
}

function EnteringCard({
  index,
  trackIndex,
  children,
}: {
  index: number
  trackIndex: number
  children: ReactNode
}) {
  if (index >= ENTER_TILES) return <>{children}</>

  return (
    <div
      className="hero-card-enter"
      style={{
        ['--hero-card-duration' as string]: `${CARD_ENTER}s`,
        ['--hero-card-delay' as string]: `${(index * MOTION.length + trackIndex) * CARD_STAGGER}s`,
      }}
    >
      {children}
    </div>
  )
}

function SquareTile({children}: {children: ReactNode}) {
  return (
    <div className="relative aspect-square lg:aspect-3/4 w-full overflow-hidden ">{children}</div>
  )
}

function CategoryLabel({category}: {category: HeroCategory}) {
  if (!category.slug) return null

  return (
    <LocalizedLink
      href={productCategoryPath(category.slug)}
      className="block border-t-site border-black dark:border-white px-5 py-4 lg:px-10 lg:py-5 text-lg lg:text-xl font-semibold transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    >
      {category.title}
    </LocalizedLink>
  )
}

function HeroMedia({item, playVideo}: {item: HeroItem; playVideo: boolean}) {
  if (stegaClean(item.type) === 'video') {
    const playbackId = item.video?.muxVideo?.playbackId
    if (!playbackId) return null

    if (!playVideo) return <MuxPreview playbackId={playbackId} />

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

/**
 * Mux's animated preview (the first few seconds as an animated WebP). Far lighter than a
 * player, so phones get motion without streaming video into every tile.
 */
function MuxPreview({playbackId}: {playbackId: string}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://image.mux.com/${playbackId}/animated.webp?width=480&fps=15`}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  )
}
