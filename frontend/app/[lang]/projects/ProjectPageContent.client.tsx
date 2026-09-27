'use client'

import {useMemo} from 'react'
import {useSearchParams} from 'next/navigation'

import type {ProjectCardData, ProjectFilterOption} from '@/app/components/project/types'
import ProjectFilters from './ProjectFilters.client'
import {GridContainer, GridBlock, GridColumn} from '@/app/components/ui/GridSystem'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import Image from '@/app/components/ui/SanityImage.client'

type ProjectPageContentProps = {
  items: ProjectCardData[]
  filters: ProjectFilterOption[]
  title?: React.ReactNode
}

export default function ProjectPageContent({items, filters}: ProjectPageContentProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')
  const activeProduct = searchParams.get('product')

  const filteredItems = useMemo(() => {
    if (!activeCategory && !activeProduct) return items

    return items.filter((item) => {
      if (activeProduct) {
        return item.product?.slug === activeProduct
      }
      if (activeCategory) {
        if (item.product?.category?.slug === activeCategory) return true

        const activeFilter = filters.find((f) => f.slug === activeCategory)
        const childSlugs = activeFilter?.products?.map((product) => product.slug) ?? []
        if (childSlugs.length > 0) {
          return childSlugs.includes(item.product?.slug ?? '')
        }
        return false
      }
      return true
    })
  }, [items, activeCategory, activeProduct, filters])

  const hasResults = filteredItems.length > 0
  const lastRowSize = filteredItems.length % 2 === 0 ? 2 : 1

  return (
    <GridContainer variant="compact">
      <ProjectFilters className="col-span-full self-start" filters={filters} />
      {hasResults ? (
        filteredItems.map((item, index) => (
          <GridColumn span={6} key={item._id}>
            <ProjectCard
              item={item}
              showBottomBorder={index < filteredItems.length - lastRowSize}
            />
          </GridColumn>
        ))
      ) : (
        <div className="col-span-full p-10 border-t-site border-black dark:border-white bg-white text-black dark:bg-black dark:text-white relative z-100">
          <p className="text-9xl leading-[1.2] font-bold ">
            No projects match the selected filters.
          </p>
        </div>
      )}
    </GridContainer>
  )
}

const ProjectCard = ({
  item,
  showBottomBorder = true,
}: {
  item: ProjectCardData
  showBottomBorder?: boolean
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
