'use client'

import {useSearchParams, useRouter} from 'next/navigation'
import {useCallback, useTransition} from 'react'

import type {ProjectFilterOption} from '@/app/components/project/types'
import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'

type ProjectFiltersProps = {
  filters: ProjectFilterOption[]
}

export default function ProjectFilters({filters}: ProjectFiltersProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = useLocale()
  const [, startTransition] = useTransition()

  const activeCategory = searchParams.get('category')
  const activeProduct = searchParams.get('product')

  const activeCategoryOption = activeCategory
    ? filters.find((f) => f.slug === activeCategory)
    : null

  const products = activeCategoryOption?.products ?? []

  const updateParams = useCallback(
    (key: string, value: string | null, clearKeys?: string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      if (clearKeys) {
        clearKeys.forEach((k) => params.delete(k))
      }
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `?${qs}` : localizedPath(lang, '/projects'), {scroll: false})
      })
    },
    [searchParams, router, startTransition, lang],
  )

  const handleCategoryClick = useCallback(
    (slug: string | null) => {
      if (!slug || slug === activeCategory) {
        updateParams('category', null, ['category', 'product'])
      } else {
        updateParams('category', slug, ['product'])
      }
    },
    [activeCategory, updateParams],
  )

  const handleProductClick = useCallback(
    (slug: string | null) => {
      if (!slug || slug === activeProduct) {
        updateParams('product', null)
      } else {
        updateParams('product', slug)
      }
    },
    [activeProduct, updateParams],
  )

  if (filters.length === 0) return null

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="flex flex-wrap gap-2 justify-center">
        <FilterButton active={!activeCategory} onClick={() => handleCategoryClick(null)}>
          All
        </FilterButton>
        {filters.map((category) => (
          <FilterButton
            key={category._id}
            active={activeCategory === category.slug}
            onClick={() => handleCategoryClick(category.slug)}
          >
            {category.title}
          </FilterButton>
        ))}
      </div>

      {products.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          <FilterButton active={!activeProduct} onClick={() => handleProductClick(null)}>
            All
          </FilterButton>
          {products.map((product) => (
            <FilterButton
              key={product._id}
              active={activeProduct === product.slug}
              onClick={() => handleProductClick(product.slug)}
            >
              {product.title}
            </FilterButton>
          ))}
        </div>
      )}
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-1 lg:py-1.5 text-xs lg:text-sm font-medium lowercase tracking-normal transition-colors ${
        active
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'border border-black/15 text-black/70 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/70 dark:hover:border-white/30 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
