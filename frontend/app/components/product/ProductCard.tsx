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
      <div className="relative">
        <div className="overflow-hidden">
          {image?.asset?._ref ? (
            <Image
              className="h-full  object-cover aspect-square mx-auto"
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
        <header className="absolute bottom-0 left-0  pt-7 pr-8 bg-white dark:bg-black">
          <h3 className="text-3xl font-semibold group-hover:underline">{title}</h3>
        </header>
      </div>
    </GridBlock>
  )
}

export default ProductCard
