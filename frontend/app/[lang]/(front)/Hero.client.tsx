'use client'
import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react'
import MuxPlayer, {type MuxCSSProperties} from '@mux/mux-player-react'
import {stegaClean} from '@sanity/client/stega'
import useEmblaCarousel from 'embla-carousel-react'

import Image from '@/app/components/ui/SanityImage.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {SliderArrow} from '@/app/components/ui/RowSlider.client'
import {useMediaQuery} from '@/app/hooks/useMediaQuery'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {productCategoryPath} from '@/app/lib/product/paths'
import {cn} from '@/app/lib/utils'
import type {HomePageQueryResult} from '@/sanity.types'
import {useHeroIntroReady} from './HeroIntro.client'

type HeroCategory = NonNullable<
  NonNullable<NonNullable<HomePageQueryResult>['hero']>['categories']
>[number]
type HeroItem = NonNullable<HeroCategory['media']>[number]

/**
 * Motion presets, applied to the columns in order.
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
    scrollDelay: spinTotal + REEL_LAND + SCROLL_HOLD,
  }
}

/** Matches Tailwind's `md` breakpoint. Below it phones get light animated previews, not players. */
const VIDEO_QUERY = '(min-width: 48rem)'

/**
 * Columns on screen at once: 1 on phones, 2 from `md`, 3 from `lg` (keep in step with the
 * `--hero-cols` classes below). With more categories than fit, the columns loop as a carousel.
 */
const CAROUSEL_BREAKPOINTS = {
  '(min-width: 48rem)': 2,
  '(min-width: 64rem)': 3,
}

/** Hides the arrows from the breakpoint where every category already fits. */
function arrowsHiddenClass(count: number) {
  if (count <= 2) return 'md:hidden'
  if (count <= 3) return 'lg:hidden'
  return ''
}

/**
 * One column per featured product category, each scrolling through the category's
 * home page media, under a label linking through to the category. The hero fills whatever
 * height its parent gives it. It is a two-row grid: the labels share the first row (as a
 * subgrid, so they line up even if one wraps) and the reels fill the second. When there are
 * more categories than fit, the columns become a looping carousel, with arrows over the ends
 * of the label row, as in the menu's `RowSlider`. `--hero-gap` drives the padding and the
 * loop maths.
 */
export default function HomeHero({
  categories,
  className,
}: {
  categories: HeroCategory[]
  className?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const count = categories.length
  // Real video players only start once we know a wide enough screen is the one in use.
  const playVideo = useMediaQuery(VIDEO_QUERY)
  // The reels and labels stay paused (in CSS) until the intro text starts revealing.
  const introReady = useHeroIntroReady()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    active: count > 1,
    breakpoints: Object.fromEntries(
      Object.entries(CAROUSEL_BREAKPOINTS).map(([query, columns]) => [
        query,
        {active: count > columns},
      ]),
    ),
    align: 'start',
    loop: true,
    direction: locale === 'ar' ? 'rtl' : 'ltr',
  })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  usePauseWhenOffscreen(rootRef)

  if (!count) return null

  return (
    <div
      ref={rootRef}
      data-hero-ready={introReady || undefined}
      className={cn(
        '[--hero-gap:calc(var(--spacing)*10)] [--hero-cols:1] md:[--hero-cols:2] lg:[--hero-cols:3]',
        'grid min-h-0 grid-rows-[auto_minmax(0,1fr)]',
        className,
      )}
      style={{['--hero-count' as string]: count}}
    >
      {/* Every column draws its own start rule, so looping never leaves a gap. The viewport
          is pulled back by one rule so the leftmost one lands on the page border. */}
      <div
        ref={emblaRef}
        className="col-start-1 row-span-2 row-start-1 -ms-(--border-width-site) grid grid-rows-subgrid overflow-hidden"
      >
        <div className="row-span-2 grid auto-cols-[calc(100%/min(var(--hero-cols),var(--hero-count)))] grid-flow-col grid-rows-subgrid">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="row-span-2 grid min-w-0 grid-rows-subgrid border-s-site border-black dark:border-white"
            >
              <CategoryLabel category={category} />
              <ScrollingColumn
                trackIndex={index}
                items={category.media ?? []}
                playVideo={playVideo}
                {...MOTION[index % MOTION.length]}
              />
            </div>
          ))}
        </div>
      </div>
      {count > 1 && (
        // Shares the label row's cell, so the arrows match its height. Only the arrows take
        // the pointer; the labels between them stay clickable.
        <div
          className={cn(
            'pointer-events-none relative z-10 col-start-1 row-start-1',
            arrowsHiddenClass(count),
          )}
        >
          {/* Each carries the label row's bottom rule across the end it covers. */}
          <SliderArrow
            direction="prev"
            onClick={scrollPrev}
            className="pointer-events-auto flex border-b-site"
          />
          <SliderArrow
            direction="next"
            onClick={scrollNext}
            className="pointer-events-auto flex border-b-site"
          />
          {/* The arrows are pointer-only, like the menu's; keyboards get these. */}
          <button
            type="button"
            className="pointer-events-auto sr-only focus:not-sr-only"
            onClick={scrollPrev}
          >
            Previous category
          </button>
          <button
            type="button"
            className="pointer-events-auto sr-only focus:not-sr-only"
            onClick={scrollNext}
          >
            Next category
          </button>
        </div>
      )}
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
  if (!items.length) return <div className="min-h-0 p-(--hero-gap)" />

  // The window is as tall as the space left below the label, which can be more than two
  // tiles on tall screens, so keep one more spare tile here.
  const {base, loop} = buildLoop(items, MIN_TILES + 1)
  const reel = reelTiming(trackIndex)

  return (
    <div className="@container flex min-h-0 flex-col p-(--hero-gap)">
      {/* Fills the column below the label. Tiles scroll through this window. */}
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

function trackTiming(durationSeconds: number, delaySeconds: number): CSSProperties {
  return {
    ['--hero-track-duration' as string]: `${durationSeconds}s`,
    ['--hero-scroll-delay' as string]: `${delaySeconds}s`,
  }
}

function SquareTile({children}: {children: ReactNode}) {
  return <div className="relative  w-full overflow-hidden ">{children}</div>
}

/**
 * The bar stays put; its text slides up into it as the hero intro starts. Centred, so the
 * carousel arrows over the row's ends don't cover it.
 */
function CategoryLabel({category}: {category: HeroCategory}) {
  // Keeps the label row's cell (and its rule) when there's nothing to link to.
  if (!category.slug) return <div className="border-b-site border-black dark:border-white" />

  return (
    <LocalizedLink
      href={productCategoryPath(category.slug)}
      className="block border-b-site border-black dark:border-white px-5 py-4 lg:px-10 lg:py-5 text-center text-lg lg:text-2xl font-semibold transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    >
      <span className="block overflow-hidden">
        <span className="hero-label-reveal block">{category.title}</span>
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
