'use client'

import type {ProductCardImage} from '@/app/components/product/types'
import OverlayArrowButton from '@/app/components/ui/OverlayArrowButton.client'
import SectionTitle from '@/app/components/ui/SectionTitle'
import SpotlightCaption from '@/app/components/ui/SpotlightCaption'
import SquareMediaStage from '@/app/components/ui/SquareMediaStage'
import {cn} from '@/app/lib/utils'
import {useState} from 'react'

import {GridBlock} from '../ui/GridSystem'
import SectionTitleMarquee from '../ui/SectionTitleMarquee'

export type OtherProductItem = {
  _id: string
  title: string
  href: string
  subtitle?: string | null
  image?: ProductCardImage
}

export default function OtherProducts({
  items,
  heading,
  className,
}: {
  items: OtherProductItem[]
  heading: string
  className?: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeItem = items.length === 0 ? undefined : items[activeIndex % items.length]

  if (!activeItem) {
    return null
  }

  const {title, href, subtitle, image} = activeItem
  const showArrows = items.length > 1

  const showItemAt = (index: number) => {
    setActiveIndex((index + items.length) % items.length)
  }

  return (
    <div className={cn(className)}>
      <SectionTitle>{heading}</SectionTitle>
      <GridBlock className="grid grid-rows-[min-content_1fr] pb-0">
        <SpotlightCaption title={title} detail={subtitle} />
        <SquareMediaStage href={href} label={`View ${title}`} image={image}>
          {showArrows ? (
            <>
              <OverlayArrowButton
                direction="next"
                label="Next"
                onClick={() => showItemAt(activeIndex + 1)}
              />
              <OverlayArrowButton
                direction="prev"
                label="Previous"
                onClick={() => showItemAt(activeIndex - 1)}
              />
            </>
          ) : null}
        </SquareMediaStage>
      </GridBlock>
    </div>
  )
}
