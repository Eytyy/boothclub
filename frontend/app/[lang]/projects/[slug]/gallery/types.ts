import type {PageImage} from '@/app/components/page/types'

export type ProjectGalleryItem = {
  id: string
  image?: PageImage
  width?: number
  height?: number
}

export type FrameRect = {
  top: number
  left: number
  width: number
  height: number
}

export type FrameTransition = {
  duration: number
  ease: readonly [number, number, number, number]
}
