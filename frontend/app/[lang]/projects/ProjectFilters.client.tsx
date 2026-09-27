'use client'

import {useSearchParams, useRouter} from 'next/navigation'
import {useCallback, useTransition, type ReactNode} from 'react'

import type {ProjectFilterOption} from '@/app/components/project/types'
import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'

type ProjectFiltersProps = {
  filters: ProjectFilterOption[]
  className?: string
}

export default function ProjectFilters({filters, className}: ProjectFiltersProps) {
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

  const selectCategory = useCallback(
    (slug: string) => {
      updateParams('category', slug, ['product'])
    },
    [updateParams],
  )

  const clearProduct = useCallback(() => {
    updateParams('product', null)
  }, [updateParams])

  const clearFilters = useCallback(() => {
    updateParams('category', null, ['category', 'product'])
  }, [updateParams])

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
    <div className="col-span-full sticky top-0 bg-white dark:bg-black z-100 self-start">
      <div className={cn('uppercase flex relative z-100', className)}>
        <div
          className={cn(
            'flex flex-nowrap overflow-x-auto min-w-0 flex-1',
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {activeCategory ? (
            <>
              <FilterButton active={!activeProduct} onClick={clearProduct} keepEndBorder>
                {activeCategoryOption?.title ?? activeCategory}
              </FilterButton>
              {products.map((product) => (
                <FilterButton
                  key={product._id}
                  active={activeProduct === product.slug}
                  onClick={() => handleProductClick(product.slug)}
                  keepEndBorder
                >
                  {product.title}
                </FilterButton>
              ))}
            </>
          ) : (
            filters.map((category) => (
              <FilterButton
                key={category._id}
                active={false}
                onClick={() => category.slug && selectCategory(category.slug)}
              >
                {category.title}
              </FilterButton>
            ))
          )}
        </div>
        {activeCategory ? (
          <FilterButton active={false} onClick={clearFilters} aria-label="Clear filters" pinned>
            X
          </FilterButton>
        ) : null}
      </div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  children,
  'aria-label': ariaLabel,
  keepEndBorder,
  pinned,
}: {
  'active': boolean
  'onClick': () => void
  'children': ReactNode
  'aria-label'?: string
  'keepEndBorder'?: boolean
  'pinned'?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'uppercase block p-10 lg:text-lg font-bold tracking-normal transition-colors border-r-site min-w-max whitespace-nowrap border-black dark:border-white border-b-site',
        pinned ? 'shrink-0' : 'flex-1',
        !keepEndBorder && 'last:border-r-0',
        active && 'bg-black text-white dark:bg-white dark:text-black',
      )}
    >
      {children}
    </button>
  )
}
