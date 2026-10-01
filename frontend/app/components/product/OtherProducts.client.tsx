import type {ProductCardImage} from '@/app/components/product/types'
import SpotlightCaption from '@/app/components/ui/SpotlightCaption'
import SquareMediaStage from '@/app/components/ui/SquareMediaStage'
import {cn} from '@/app/lib/utils'

import {GridBlock} from '../ui/GridSystem'

export type OtherProductItem = {
  _id: string
  title: string
  href: string
  subtitle?: string | null
  image?: ProductCardImage
}

export default function OtherProducts({
  items,
  className,
}: {
  items: OtherProductItem[]
  className?: string
}) {
  return (
    <div className={cn(className)}>
      <h2 className="text-lg font-semibold uppercase p-5 lg:p-10 pb-0 lg:pb-0 flex items-center gap-5">
        <span className="block w-4 h-4 bg-black dark:bg-white"></span>
        Other Products
      </h2>
      {items.map((item) => (
        <GridBlock
          key={item._id}
          className="grid grid-rows-[min-content_1fr] gap-5 last:border-b-0"
          borders="bottom"
        >
          <SquareMediaStage href={item.href} label={`View ${item.title}`} image={item.image} />
          <SpotlightCaption title={item.title} />
        </GridBlock>
      ))}
    </div>
  )
}
