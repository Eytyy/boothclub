'use client'

import {Suspense, useMemo} from 'react'
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

/**
 * The page is prerendered, and `useSearchParams()` makes everything up to the nearest
 * Suspense boundary render only on the client. The fallback is the same grid with no
 * filters active, so the prerendered HTML already holds the full grid instead of nothing.
 */
export default function ProjectPageContent({items, filters}: ProjectPageContentProps) {
  return (
    <Suspense
      fallback={
        <ProjectGrid items={items} filters={filters} activeCategory={null} activeProduct={null} />
      }
    >
      <ProjectGridFromSearchParams items={items} filters={filters} />
    </Suspense>
  )
}

function ProjectGridFromSearchParams({items, filters}: ProjectPageContentProps) {
  const searchParams = useSearchParams()
  return (
    <ProjectGrid
      items={items}
      filters={filters}
      activeCategory={searchParams.get('category')}
      activeProduct={searchParams.get('product')}
    />
  )
}

function ProjectGrid({
  items,
  filters,
  activeCategory,
  activeProduct,
}: ProjectPageContentProps & {activeCategory: string | null; activeProduct: string | null}) {
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
    <div>
      <ProjectFilters
        filters={filters}
        activeCategory={activeCategory}
        activeProduct={activeProduct}
      />
      <GridContainer columns={[4, 4, 4]} className="z-90">
        {hasResults ? (
          filteredItems.map((item, index) => (
            <GridColumn span={4} key={item._id}>
              <ProjectCard
                item={item}
                showBottomBorder={index < filteredItems.length - lastRowSize}
              />
            </GridColumn>
          ))
        ) : (
          <div className="col-span-full p-10  relative z-90 min-h-[min(100dvh-var(--header-height),1000px)]">
            <p className="body-text">No projects match the selected filters.</p>
          </div>
        )}
      </GridContainer>
    </div>
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
      <div className="aspect-square mx-auto overflow-hidden">
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
      <div className="mt-5">
        {item.product?.title ? (
          <span className="shrink-0 text-base text-black/60 dark:text-white/60">
            {item.product.title}
          </span>
        ) : null}
        <h3 className="text-3xl font-semibold leading-tight">{item.title}</h3>
      </div>
    </GridBlock>
  )
}
