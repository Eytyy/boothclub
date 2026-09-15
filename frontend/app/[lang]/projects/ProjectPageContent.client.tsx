'use client'

import {useMemo} from 'react'
import {useSearchParams} from 'next/navigation'

import type {ProjectCardData, ProjectFilterOption} from '@/app/components/project/types'
import ProjectFilters from './ProjectFilters.client'
import ProjectParallaxGrid from './ProjectParallaxGrid.client'

type ProjectPageContentProps = {
  items: ProjectCardData[]
  filters: ProjectFilterOption[]
  featuredCount: number
}

export default function ProjectPageContent({
  items,
  filters,
  featuredCount,
}: ProjectPageContentProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')
  const activeProduct = searchParams.get('product')
  const isFiltered = Boolean(activeCategory || activeProduct)

  const filteredItems = useMemo(() => {
    if (!activeCategory && !activeProduct) return items

    return items.filter((item) => {
      if (activeProduct) {
        return item.products?.some((product) => product.slug === activeProduct)
      }
      if (activeCategory) {
        const categoryMatch = item.products?.some(
          (product) => product.category?.slug === activeCategory,
        )
        if (categoryMatch) return true

        const activeFilter = filters.find((f) => f.slug === activeCategory)
        const childSlugs = activeFilter?.products?.map((product) => product.slug) ?? []
        if (childSlugs.length > 0) {
          return item.products?.some((product) => childSlugs.includes(product.slug ?? ''))
        }
        return false
      }
      return true
    })
  }, [items, activeCategory, activeProduct, filters])

  return (
    <>
      <div className="relative z-10 mb-10">
        <ProjectFilters filters={filters} />
      </div>
      <div className="relative">
        {filteredItems.length > 0 ? (
          <ProjectParallaxGrid
            items={filteredItems}
            isFiltered={isFiltered}
            featuredCount={featuredCount}
          />
        ) : (
          <p className="text-black/50 dark:text-white/50">
            No projects match the selected filters.
          </p>
        )}
      </div>
    </>
  )
}
