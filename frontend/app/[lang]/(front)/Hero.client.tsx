'use client'
import {GridContainer} from '@/app/components/ui/GridSystem'
import TextReveal from '@/app/components/ui/TextReveal.client'

/** Seconds for one tile to travel its own height. Lower is faster. */
const columns = [
  {secondsPerItem: 14, items: [1, 2, 3, 4]},
  {secondsPerItem: 22, items: [1, 2, 3]},
  {secondsPerItem: 9, items: [1, 2, 3, 4, 5, 6]},
]

export default function HomeHero() {
  return (
    <div>
      <GridContainer
        columns={[4, 4, 4]}
        className="grid grid-cols-3 border-x-0 p-0 lg:p-0 mx-0 lg:mx-0"
      >
        {columns.map((column, index) => (
          <ScrollingColumn key={index} {...column} />
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

function ScrollingColumn({secondsPerItem, items}: {secondsPerItem: number; items: number[]}) {
  const loop = [...items, ...items]

  return (
    <div className="@container p-10">
      {/* Two tiles plus the gap between them. Extra tiles scroll through this window. */}
      <div className="overflow-hidden" style={{height: 'calc(200cqw + var(--spacing) * 10)'}}>
        <div
          className="hero-column-track flex flex-col"
          style={{['--hero-column-duration' as string]: `${items.length * secondsPerItem}s`}}
        >
          {loop.map((item, index) => (
            <div key={`${item}-${index}`} className="pb-10" aria-hidden={index >= items.length}>
              <MediaBlock label={item} />
            </div>
          ))}
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
