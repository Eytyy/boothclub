'use client'
import {GridContainer} from '@/app/components/ui/GridSystem'
import TextReveal from '@/app/components/ui/TextReveal.client'

/**
 * `secondsPerItem` is how long one tile takes to travel its own height. Lower is faster.
 * `offset` is how far up the column sits, as a fraction of one tile, so the columns
 * don't share an edge before the loop starts.
 */
const columns = [
  {secondsPerItem: 14, offset: 0.22, items: [1, 2, 3, 4]},
  {secondsPerItem: 22, offset: 0.7, items: [1, 2, 3]},
  {secondsPerItem: 9, offset: 0.41, items: [1, 2, 3, 4, 5, 6]},
]

const VISIBLE_ROWS = 2
/** First rows that can sit in the window once a column is offset. */
const ENTER_ROWS = VISIBLE_ROWS + 1
const CARD_STAGGER = 0.1
const CARD_ENTER = 0.55
const SCROLL_HOLD = 0.25

/** Scroll starts once the last entering card has landed, plus a short hold. */
const scrollDelay = (ENTER_ROWS * columns.length - 1) * CARD_STAGGER + CARD_ENTER + SCROLL_HOLD

export default function HomeHero() {
  return (
    <div>
      <GridContainer
        columns={[4, 4, 4]}
        className="grid grid-cols-3 border-x-0 p-0 lg:p-0 mx-0 lg:mx-0"
      >
        {columns.map((column, index) => (
          <ScrollingColumn key={index} columnIndex={index} {...column} />
        ))}
      </GridContainer>
      <div className="p-10 pb-0 border-t-site">
        <TextReveal
          className="pointer-events-none  text-reveal-default "
          text={'Photo experiences brands build launches around.'}
        />
      </div>
    </div>
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
  items: number[]
}) {
  const loop = [...items, ...items]

  return (
    <div className="@container p-10">
      {/* Two tiles plus the gap between them. Extra tiles scroll through this window. */}
      <div className="overflow-hidden" style={{height: 'calc(200cqw + var(--spacing) * 10)'}}>
        <div style={{transform: `translate3d(0, calc((100cqw + var(--spacing) * 10) * ${-offset}), 0)`}}>
          <div
            className="hero-column-track flex flex-col"
            style={{
              ['--hero-column-duration' as string]: `${items.length * secondsPerItem}s`,
              ['--hero-scroll-delay' as string]: `${scrollDelay}s`,
            }}
          >
            {loop.map((item, index) => {
              const enters = index < ENTER_ROWS
              return (
                <div key={`${item}-${index}`} className="pb-10" aria-hidden={index >= items.length}>
                  <div
                    className={enters ? 'hero-card-enter' : undefined}
                    style={
                      enters
                        ? {
                            ['--hero-card-duration' as string]: `${CARD_ENTER}s`,
                            ['--hero-card-delay' as string]: `${(index * columns.length + columnIndex) * CARD_STAGGER}s`,
                          }
                        : undefined
                    }
                  >
                    <MediaBlock label={item} />
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

const MediaBlock = ({label}: {label: number}) => {
  return (
    <div className="relative flex aspect-square w-full cursor-pointer items-center justify-center bg-black text-white">
      {label}
    </div>
  )
}
