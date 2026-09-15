import {cn} from '@/app/lib/utils'

export type ProductTagItem = {
  _id: string
  title?: string | null
  slug?: string | null
}

export default function ProductTagList({
  items,
  className,
}: {
  items: ProductTagItem[] | null | undefined
  className?: string
}) {
  if (!items?.length) return null

  return (
    <div
      className={cn(
        'flex flex-wrap gap-4 justify-center max-w-[1200px] mx-auto px-5 lg:px-0',
        className,
      )}
    >
      {items.map((item) =>
        item ? (
          <span
            key={item._id}
            className="w-full text-center lg:text-left md:w-auto border bg:black text-white dark:text-black bg-black dark:bg-white px-4 py-1 "
          >
            {item.title}
          </span>
        ) : null,
      )}
    </div>
  )
}
