'use client'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import MuxPlayer, {type MuxCSSProperties} from '@mux/mux-player-react'
import {stegaClean} from '@sanity/client/stega'
import useEmblaCarousel from 'embla-carousel-react'

import Image from '@/app/components/ui/SanityImage.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
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
/** Fewest tiles a track repeats up to: what fits in the window once offset, plus one spare. */
const MIN_TILES = VISIBLE_TILES + 1

/**
 * Slot-machine intro. Every reel spins through whole copies of its tiles at `REEL_SPIN`
 * seconds a copy, then takes `REEL_LAND` seconds to slow down and land. Each reel along
 * the row spins `REEL_EXTRA_SPINS` more times than the one before, so they stop in turn.
 */
const REEL_SPIN = 0.18
const REEL_SPINS = 3
const REEL_EXTRA_SPINS = 2
const REEL_LAND = 1.1
/** Pause between a reel landing and its slow scroll starting. */
const SCROLL_HOLD = 0.4

function reelTiming(trackIndex: number) {
  const spins = REEL_SPINS + (trackIndex % MOTION.length) * REEL_EXTRA_SPINS
  const spinTotal = spins * REEL_SPIN
  return {
    style: {
      ['--hero-reel-spin' as string]: `${REEL_SPIN}s`,
      ['--hero-reel-spins' as string]: spins,
      ['--hero-reel-spin-total' as string]: `${spinTotal}s`,
      ['--hero-reel-land' as string]: `${REEL_LAND}s`,
      // Stays blurred through the spins and clears as the reel slows.
      ['--hero-reel-blur' as string]: `${spinTotal + REEL_LAND * 0.5}s`,
    } as CSSProperties,
    landedAt: spinTotal + REEL_LAND,
    scrollDelay: spinTotal + REEL_LAND + SCROLL_HOLD,
  }
}

/** Row tile width on mobile, as a share of the hero width. Leaves the next tile peeking in. */
const ROW_TILE = '60cqw'

/** Matches Tailwind's `md` breakpoint, where the hero switches from rows to columns. */
const COLUMNS_QUERY = '(min-width: 48rem)'

/** Columns on screen at once from `md` up. Any more and the columns become a carousel. */
const VISIBLE_COLUMNS = 3

/**
 * One column per featured product category, each scrolling through the category's
 * home page media, with the category name linking through underneath.
 * Below `md` the columns become horizontal rows; from `md` up they scroll vertically
 * and fill whatever height the parent gives the hero (`flex-1`), so the labels stay
 * pinned to its bottom edge. Both layouts are rendered and CSS picks one, so the server
 * HTML never flashes the wrong layout. `--hero-gap` drives the padding and the loop maths.
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
      className="[--hero-gap:calc(var(--spacing)*5)] md:flex md:min-h-0 md:flex-1 md:flex-col"
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
            <CategoryLabel category={category} revealAt={labelsRevealAt(categories.length)} />
          </div>
        ))}
      </div>
      <ColumnsCarousel categories={categories} playVideo={showColumns} />
    </div>
  )
}

/**
 * Up to `VISIBLE_COLUMNS` categories share the width as a static row. Beyond that the
 * row becomes a looping carousel, still showing `VISIBLE_COLUMNS` at a time.
 */
function ColumnsCarousel({
  categories,
  playVideo,
}: {
  categories: HeroCategory[]
  playVideo: boolean
}) {
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const isCarousel = categories.length > VISIBLE_COLUMNS
  const areaRef = useRef<HTMLDivElement>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    active: isCarousel,
    align: 'start',
    loop: true,
    direction: isRtl ? 'rtl' : 'ltr',
  })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const columnWidth = `calc(100% / ${Math.min(categories.length, VISIBLE_COLUMNS)})`

  return (
    <div ref={areaRef} className="relative hidden md:flex md:min-h-0 md:flex-1 md:flex-col">
      {/* Every column draws its own start rule, so looping never leaves a gap. The viewport
          is pulled back by one rule so the leftmost one lands on the page border. */}
      <div
        ref={emblaRef}
        className={cn('-ms-(--border-width-site) min-h-0 flex-1 overflow-hidden')}
      >
        <div className="flex h-full">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="flex h-full min-w-0 shrink-0 grow-0 flex-col border-s-site border-black dark:border-white"
              style={{flexBasis: columnWidth}}
            >
              <ScrollingColumn
                trackIndex={index}
                items={category.media ?? []}
                playVideo={playVideo}
                {...MOTION[index % MOTION.length]}
              />
              <CategoryLabel category={category} revealAt={labelsRevealAt(categories.length)} />
            </div>
          ))}
        </div>
      </div>
      {isCarousel && (
        <>
          <CursorArrow
            areaRef={areaRef}
            // Physical sides: in RTL the next column sits to the left.
            onLeft={isRtl ? scrollNext : scrollPrev}
            onRight={isRtl ? scrollPrev : scrollNext}
          />
          {/* Keyboard and screen reader controls; the mouse uses the cursor arrow. */}
          <button type="button" className="sr-only focus:not-sr-only" onClick={scrollPrev}>
            Previous category
          </button>
          <button type="button" className="sr-only focus:not-sr-only" onClick={scrollNext}>
            Next category
          </button>
        </>
      )}
    </div>
  )
}

/** Share of the width on each side where the cursor arrow shows. The middle stays a plain pointer. */
const ARROW_EDGE_ZONE = 0.35

/**
 * A round arrow that follows the mouse near either edge of the columns, pointing toward
 * that edge; a click scrolls that way. It stands in for the pointer while shown, and hides
 * around the middle, over the category labels (they're links) and for touch, where
 * dragging does the job. It moves through a ref and listens on the area itself, so
 * tracking the mouse never re-renders the columns.
 */
function CursorArrow({
  areaRef,
  onLeft,
  onRight,
}: {
  areaRef: RefObject<HTMLElement | null>
  onLeft: () => void
  onRight: () => void
}) {
  const arrowRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  // The last side stays put while hidden, so the arrow doesn't spin as it fades out.
  const [side, setSide] = useState<'left' | 'right'>('right')
  const activeSideRef = useRef<'left' | 'right' | null>(null)
  const actionsRef = useRef({onLeft, onRight})

  useEffect(() => {
    actionsRef.current = {onLeft, onRight}
  }, [onLeft, onRight])

  useEffect(() => {
    const area = areaRef.current
    if (!area) return

    const overMedia = (event: PointerEvent | MouseEvent) =>
      !(event.target instanceof Element && event.target.closest('a, button'))

    const show = (next: 'left' | 'right' | null) => {
      activeSideRef.current = next
      area.style.cursor = next ? 'none' : ''
      setVisible(next !== null)
      if (next) setSide(next)
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !overMedia(event)) return show(null)
      const rect = area.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      arrowRef.current?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`)
      const edge = rect.width * ARROW_EDGE_ZONE
      show(x < edge ? 'left' : x > rect.width - edge ? 'right' : null)
    }
    const leave = () => show(null)
    // Embla swallows the click that ends a drag, so this only fires on a real click.
    const click = (event: MouseEvent) => {
      if (!overMedia(event)) return
      const {onLeft, onRight} = actionsRef.current
      if (activeSideRef.current === 'left') onLeft()
      else if (activeSideRef.current === 'right') onRight()
    }

    area.addEventListener('pointermove', move)
    area.addEventListener('pointerleave', leave)
    area.addEventListener('click', click)
    return () => {
      area.style.cursor = ''
      area.removeEventListener('pointermove', move)
      area.removeEventListener('pointerleave', leave)
      area.removeEventListener('click', click)
    }
  }, [areaRef])

  return (
    <div ref={arrowRef} aria-hidden className="pointer-events-none absolute top-0 left-0 z-10">
      <div
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl font-bold text-white transition-[opacity,scale] duration-200 dark:bg-white dark:text-black',
          visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
      >
        <span className={cn('transition-transform duration-300', side === 'left' && 'rotate-180')}>
          →
        </span>
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
  if (!items.length) return <div className="min-h-0 flex-1 p-(--hero-gap)" />

  // The window is as tall as the space left above the label, which can be more than two
  // tiles on tall screens, so keep one more spare tile here.
  const {base, loop} = buildLoop(items, MIN_TILES + 1)
  const reel = reelTiming(trackIndex)

  return (
    <div className="@container flex min-h-0 flex-1 flex-col p-(--hero-gap)">
      {/* Fills the column above the label. Tiles scroll through this window. */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          style={{
            transform: `translate3d(0, calc((100cqw + var(--hero-gap)) * ${-offset}), 0)`,
          }}
        >
          <div className="hero-reel" style={reel.style}>
            <div
              className="hero-column-track flex flex-col"
              style={trackTiming(base.length * secondsPerItem, reel.scrollDelay)}
            >
              {loop.map((item, index) => (
                <div
                  key={`${item._key}-${index}`}
                  className="pb-(--hero-gap)"
                  aria-hidden={index >= items.length}
                >
                  <SquareTile>
                    <HeroMedia item={item} playVideo={playVideo} />
                  </SquareTile>
                </div>
              ))}
            </div>
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

  const {base, loop} = buildLoop(items, MIN_TILES)
  const step = `(${ROW_TILE} + var(--hero-gap))`
  const reel = reelTiming(trackIndex)

  return (
    <div className="overflow-hidden">
      <div style={{transform: `translate3d(calc(${step} * ${-offset}), 0, 0)`}}>
        <div className="hero-reel hero-reel--x w-max" style={reel.style}>
          <div
            className={cn('hero-row-track flex w-max', reverse && 'hero-row-track--reverse')}
            style={trackTiming(base.length * secondsPerItem, reel.scrollDelay)}
          >
            {loop.map((item, index) => (
              <div
                key={`${item._key}-${index}`}
                className="shrink-0 pr-(--hero-gap)"
                style={{width: `calc${step}`}}
                aria-hidden={index >= items.length}
              >
                <SquareTile>
                  <HeroMedia item={item} playVideo={false} />
                </SquareTile>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function trackTiming(durationSeconds: number, delaySeconds: number): CSSProperties {
  return {
    ['--hero-track-duration' as string]: `${durationSeconds}s`,
    ['--hero-scroll-delay' as string]: `${delaySeconds}s`,
  }
}

function SquareTile({children}: {children: ReactNode}) {
  return <div className="relative  w-full overflow-hidden ">{children}</div>
}

/** Labels all arrive together once the last reel on screen has landed. */
function labelsRevealAt(categoryCount: number) {
  return reelTiming(Math.min(categoryCount, MOTION.length) - 1).landedAt
}

/** The bar stays put; its text slides up into it once the reels have landed. */
function CategoryLabel({category, revealAt}: {category: HeroCategory; revealAt: number}) {
  if (!category.slug) return null

  return (
    <LocalizedLink
      href={productCategoryPath(category.slug)}
      className="block border-t-site border-black dark:border-white px-5 py-4 lg:px-10 lg:py-5 text-lg lg:text-xl font-semibold transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    >
      <span className="block overflow-hidden">
        <span
          className="hero-label-reveal block"
          style={{['--hero-label-delay' as string]: `${revealAt}s`}}
        >
          {category.title}
        </span>
      </span>
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
