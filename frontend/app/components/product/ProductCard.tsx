import {ProductCardImage} from '@/app/components/product/types'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import {GridBlock} from '../ui/GridSystem'

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
    <GridBlock
      as={LocalizedLink}
      borders="bottom"
      href={href}
      className={cn('group block', className)}
    >
      <div className="space-y-10">
        <h3 className="text-4xl font-bold group-hover:underline">{title}</h3>
        <div className="overflow-hidden">
          {image?.asset?._ref ? (
            <Image
              className="h-full w-2/3 object-cover aspect-square mx-auto"
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
        <div className="space-y-2 w-2/3 ml-auto">{excerpt ? <p>{excerpt}</p> : null}</div>
      </div>
    </GridBlock>
  )
}

export default ProductCard
