import Image from '@/app/components/ui/SanityImage.client'
import type {ProjectGalleryItem} from './types'

export default function GalleryPhoto({
  item,
  width,
  height,
}: {
  item: ProjectGalleryItem
  width: number
  height: number
}) {
  const imageRef = item.image?.asset?._ref
  if (!imageRef || !item.image) {
    return <div className="h-full w-full bg-black/5 dark:bg-white/5" />
  }

  return (
    <Image
      id={imageRef}
      alt={item.image.alt || ''}
      className="h-full w-full object-cover"
      width={width}
      height={height}
      mode="cover"
      hotspot={item.image.hotspot ?? undefined}
      crop={item.image.crop ?? undefined}
      preview={item.image.lqip ?? undefined}
    />
  )
}
