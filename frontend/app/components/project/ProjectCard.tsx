import {GridBlock} from '../ui/GridSystem'
import LocalizedLink from '../ui/LocalizedLink'
import Image from '../ui/SanityImage.client'
import {ProjectCardData} from './types'

export const ProjectCard = ({
  item,
  showBottomBorder = true,
  className,
}: {
  item: ProjectCardData
  showBottomBorder?: boolean
  className?: string
}) => {
  return (
    <GridBlock
      className="pt-8"
      as={LocalizedLink}
      href={`/projects/${item.slug}`}
      borders={showBottomBorder ? 'bottom' : 'none'}
    >
      <div className="mb-5">
        <h3 className="text-3xl font-semibold leading-tight">{item.title}</h3>
        {item.product?.title ? (
          <span className="shrink-0 text-base text-black/60 dark:text-white/60">
            {item.product.title}
          </span>
        ) : null}
      </div>
      <div className="aspect-square w-2/3 mx-auto overflow-hidden">
        {item.mainImage?.asset?._ref ? (
          <Image
            className="h-full w-full  object-cover"
            id={item.mainImage.asset._ref}
            alt={item.mainImage.alt || item.title}
            width={800}
            height={800}
            mode="cover"
            hotspot={item.mainImage.hotspot}
            crop={item.mainImage.crop}
            preview={item.mainImage.lqip ?? undefined}
          />
        ) : (
          <div className="h-full w-full border-2 border-black dark:border-white" />
        )}
      </div>
    </GridBlock>
  )
}
