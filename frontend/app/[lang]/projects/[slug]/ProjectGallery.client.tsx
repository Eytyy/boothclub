'use client'

import CollapsedGallery from './gallery/CollapsedGallery'
import ExpandedGalleryOverlay from './gallery/ExpandedGalleryOverlay.client'
import type {ProjectGalleryItem} from './gallery/types'
import {useProjectGallery} from './gallery/useProjectGallery'

export type {ProjectGalleryItem}

export default function ProjectGallery({items}: {items: ProjectGalleryItem[]}) {
  const gallery = useProjectGallery(items)

  if (items.length === 0 || !gallery.currentItem) {
    return null
  }

  return (
    <>
      <CollapsedGallery
        items={items}
        emblaRef={gallery.emblaRef}
        collapsedRef={gallery.collapsedRef}
        overlayVisible={gallery.overlayVisible}
        isExpanded={gallery.isExpanded}
        onOpen={gallery.openGallery}
      />
      {gallery.isPortalReady && gallery.overlayVisible ? (
        <ExpandedGalleryOverlay
          items={items}
          currentItem={gallery.currentItem}
          originRect={gallery.originRect}
          frameRect={gallery.frameRect}
          isExpanded={gallery.isExpanded}
          showCover={gallery.showCover}
          canScroll={gallery.canScroll}
          frameTransition={gallery.frameTransition}
          targetRef={gallery.targetRef}
          onClose={gallery.closeGallery}
          onAnimationComplete={gallery.handleFrameAnimationComplete}
        />
      ) : null}
    </>
  )
}
