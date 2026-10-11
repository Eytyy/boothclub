'use client'

import {useSearchParams, useRouter} from 'next/navigation'
import {useCallback, useTransition, type ReactNode} from 'react'
import {AnimatePresence, motion} from 'framer-motion'

import type {ProjectFilterOption} from '@/app/components/project/types'
import RowSlider from '@/app/components/ui/RowSlider.client'
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

  // A category is a toggle: picking it opens its products, picking it again clears the filter.
  const toggleCategory = useCallback(
    (slug: string) => {
      updateParams('category', slug === activeCategory ? null : slug, ['product'])
    },
    [activeCategory, updateParams],
  )

  const toggleProduct = useCallback(
    (slug: string) => {
      updateParams('product', slug === activeProduct ? null : slug)
    },
    [activeProduct, updateParams],
  )

  if (filters.length === 0) return null

  return (
    <div className="col-span-full z-95 sticky top-(--header-height) bg-white dark:bg-black  self-start mx-10 border-x-site border-black dark:border-white">
      {/* Bottom rules sit on the rows, not the buttons, so the slider's arrows stop above them. */}
      <RowSlider
        className={cn(
          'uppercase relative z-100 border-b-site border-black dark:border-white',
          className,
        )}
      >
        <div className="flex flex-nowrap">
          {filters.map((category) => {
            const isActive = !!category.slug && category.slug === activeCategory
            const hasProducts = !!category.products?.length
            return (
              <FilterButton
                key={category._id}
                active={isActive}
                onClick={() => category.slug && toggleCategory(category.slug)}
                aria-expanded={hasProducts ? isActive : undefined}
                aria-controls={hasProducts ? productsPanelId : undefined}
              >
                {hasProducts && <ExpandIcon isOpen={isActive} />}
                {category.title}
              </FilterButton>
            )
          })}
        </div>
      </RowSlider>
      <AnimatePresence initial={false} mode="wait">
        {products.length > 0 && (
          <motion.div
            key={activeCategory}
            id={productsPanelId}
            className="overflow-hidden"
            initial={{height: 0}}
            animate={{height: 'auto'}}
            exit={{height: 0}}
            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
          >
            <RowSlider className="uppercase border-b-site border-black dark:border-white">
              <div className="flex flex-nowrap">
                {products.map((product) => (
                  <FilterButton
                    key={product._id}
                    active={!!product.slug && product.slug === activeProduct}
                    onClick={() => product.slug && toggleProduct(product.slug)}
                  >
                    {product.title}
                  </FilterButton>
                ))}
              </div>
            </RowSlider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const productsPanelId = 'project-filter-products'

function FilterButton({
  active,
  onClick,
  children,
  'aria-expanded': ariaExpanded,
  'aria-controls': ariaControls,
}: {
  'active': boolean
  'onClick': () => void
  'children': ReactNode
  'aria-expanded'?: boolean
  'aria-controls'?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={cn(
        'uppercase flex flex-1 items-center justify-center gap-3 p-5 lg:text-lg font-bold tracking-normal min-w-max whitespace-nowrap cursor-pointer transition-colors',
        'border-e-site last:border-e-0 border-black dark:border-white',
        active
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
      )}
    >
      {children}
    </button>
  )
}

/** The menu group's circled toggle, with a chevron that flips up while the products show. */
function ExpandIcon({isOpen}: {isOpen: boolean}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center shrink-0 w-7 h-7 rounded-full border-2"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </span>
  )
}
