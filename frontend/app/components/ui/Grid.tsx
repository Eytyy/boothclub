'use client'

import {type ReactNode} from 'react'

type ParallaxGridProps<T extends {_id: string}> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  gridClassName?: string
}

const DEFAULT_GRID_CLASS =
  'grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3 md:gap-10 2xl:gap-20 overflow-x-clip'

export default function Grid<T extends {_id: string}>({
  items,
  renderItem,
  className,
  gridClassName = DEFAULT_GRID_CLASS,
}: ParallaxGridProps<T>) {
  return (
    <div className={className}>
      <div className={gridClassName}>
        {items.map((item, index) => {
          return (
            <div key={item._id} className="col-span-1">
              {renderItem(item, index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
