import MediaItem, {type MediaBlockData} from './MediaItem.client'

export default function SplitMediaBlock({
  left,
  right,
}: {
  left: MediaBlockData | null | undefined
  right: MediaBlockData | null | undefined
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:gap-10 md:grid-cols-2 px-5 lg:px-10">
      <MediaItem media={left} aspect="square" />
      <MediaItem media={right} aspect="square" />
    </div>
  )
}
