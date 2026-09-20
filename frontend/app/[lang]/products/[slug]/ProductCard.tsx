import {ProductCardImage} from '@/app/components/product/types'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'

const ProductCard = ({
  href,
  title,
  excerpt,
  image,
  className,
}: {
  href: string
  title: string
  excerpt?: string | null
  image?: ProductCardImage
  className?: string
}) => {
  return (
    <LocalizedLink
      href={href}
      className={cn('group p-20 border-b-4 border-black dark:border-white block', className)}
    >
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden">
          {image?.asset?._ref ? (
            <Image
              className="h-full w-full object-cover"
              id={image.asset._ref}
              alt={image.alt || title}
              width={800}
              height={800}
              mode="cover"
              hotspot={image.hotspot}
              crop={image.crop}
              preview={image.lqip ?? undefined}
            />
          ) : (
            <div className="h-full w-full border-2 border-black dark:border-white" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-bold group-hover:underline">{title}</h3>
          {excerpt ? <p>{excerpt}</p> : null}
        </div>
      </div>
    </LocalizedLink>
  )
}

export default ProductCard
