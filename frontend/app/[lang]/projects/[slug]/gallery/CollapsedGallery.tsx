import type {RefObject} from 'react'
import type {UseEmblaCarouselType} from 'embla-carousel-react'

import {cn} from '@/app/lib/utils'
import {COVER_SIZE, toggleButtonClassName} from './constants'
import GalleryPhoto from './GalleryPhoto'
import type {ProjectGalleryItem} from './types'

type CollapsedGalleryProps = {
  items: ProjectGalleryItem[]
  emblaRef: UseEmblaCarouselType[0]
  collapsedRef: RefObject<HTMLDivElement | null>
  overlayVisible: boolean
  isExpanded: boolean
  onOpen: () => void
}

export default function CollapsedGallery({
  items,
  emblaRef,
  collapsedRef,
  overlayVisible,
  isExpanded,
  onOpen,
}: CollapsedGalleryProps) {
  return (
    <div className="relative flex aspect-square items-center justify-center">
      <button
        type="button"
        className={cn(toggleButtonClassName, 'right-5', overlayVisible && 'invisible')}
        aria-expanded={isExpanded}
        aria-label="Expand gallery"
        onClick={onOpen}
      >
        <span aria-hidden="true">+</span>
      </button>
      <div
        ref={collapsedRef}
        className={cn('h-1/2 w-1/2 overflow-hidden', overlayVisible && 'invisible')}
      >
        <div className="h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full">
            {items.map((item) => (
              <div key={item.id} className="min-w-0 h-full shrink-0 flex-[0_0_100%]">
                <GalleryPhoto item={item} width={COVER_SIZE} height={COVER_SIZE} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
