import MediaItem, {type MediaBlockData} from './MediaItem.client'

export default function FullMediaBlock({media}: {media: MediaBlockData | null | undefined}) {
  return (
    <div className="w-full px-5 lg:px-10">
      <MediaItem media={media} aspect="video" />
    </div>
  )
}
