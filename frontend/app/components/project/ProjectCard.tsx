import Image from '@/app/components/ui/SanityImage.client'
import LocalizedLink from '@/app/components/ui/LocalizedLink'

import type {ProjectCardData} from './types'
import {cn} from '@/app/lib/utils'

type ProjectCardProps = {
  item: ProjectCardData
  index?: number
  className?: string
}

export default function ProjectCard({item, className}: ProjectCardProps) {
  const imageRef = item.mainImage?.asset?._ref
  const mainProduct = item.products?.[0]
  return (
    <LocalizedLink href={`/projects/${item.slug}`} className={cn('group block', className)}>
      <div className="overflow-hidden rounded-sm">
        {imageRef ? (
          <Image
            id={imageRef}
            alt={item.mainImage?.alt || item.title || ''}
            className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            width={600}
            height={600}
            mode="cover"
            hotspot={item.mainImage?.hotspot ?? undefined}
            crop={item.mainImage?.crop ?? undefined}
            preview={item.mainImage?.lqip ?? undefined}
          />
        ) : (
          <div className="aspect-square w-full bg-black/5 dark:bg-white/5" />
        )}
      </div>
      <div className="flex flex-col items-start gap-2 py-4">
        {mainProduct?.title ? (
          <span className="border text-white dark:text-black bg-black dark:bg-white px-2 py-1 text-xs dark:border-white">
            {mainProduct.title}
          </span>
        ) : null}
        {item.title ? (
          <h3 className="text-xl font-semibold leading-[1.1] lg:text-2xl 2xl:text-3xl">
            {item.title}
          </h3>
        ) : null}
      </div>
    </LocalizedLink>
  )
}
