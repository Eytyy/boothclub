'use client'

import {useRef, useState} from 'react'
import {motion, useInView, useReducedMotion, AnimatePresence, type Variants} from 'framer-motion'

import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import {productPath} from '@/app/lib/product/paths'
import ArrowButton from '@/app/components/ui/ArrowButton'
import {useImageCycle} from '@/app/hooks/useImageCycle'
import type {ProductCardData, ProductFeaturedProjectItem} from './types'
import useEmblaCarousel from 'embla-carousel-react'
import ArrowLink from '../ui/ArrowLink'

type ValidProduct = ProductCardData & {_id: string}

type Props = {
  products: ProductCardData[]
}

const listStaggerVariants: Variants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.2}},
}

const titleEntryVariants: Variants = {
  hidden: {y: 20, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {duration: 0.5, ease: [0.22, 1, 0.36, 1]},
  },
}

const imageRevealVariants: Variants = {
  hidden: {opacity: 0, scale: 0},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 0.6, ease: [0.22, 1, 0.36, 1]},
  },
}

const excerptVariants: Variants = {
  hidden: {opacity: 0, y: 12},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.15},
  },
  exit: {
    opacity: 0,
    transition: {duration: 0.2, ease: [0.22, 1, 0.36, 1]},
  },
}

export default function FeaturedProductsCarousel({products}: Props) {
  const validProducts = products.filter((p): p is ValidProduct => '_id' in p)
  if (!validProducts.length) return null

  return (
    <>
      <DesktopLayout products={validProducts} />
      <MobileLayout products={validProducts} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getValidFeaturedProjects(product: ValidProduct): ProductFeaturedProjectItem[] {
  const list = product.featuredProjects ?? []
  return list.filter((item): item is ProductFeaturedProjectItem =>
    Boolean(item?.mainImage?.asset?._ref),
  )
}

/* ------------------------------------------------------------------ */
/* Featured project image stage                                       */
/* ------------------------------------------------------------------ */

type FeaturedProjectsStageProps = {
  product: ValidProduct
  className?: string
  enabled: boolean
}

function FeaturedProjectsStage({product, className, enabled}: FeaturedProjectsStageProps) {
  const productImage = product.mainImage?.asset?._ref ? product.mainImage : null
  const items = productImage ? [] : getValidFeaturedProjects(product)
  const stageRef = useRef<HTMLDivElement>(null)
  const isFullyInView = useInView(stageRef, {amount: 'all'})
  const cyclingEnabled = enabled && isFullyInView && items.length > 1
  const {index, progress} = useImageCycle(items.length, cyclingEnabled)

  if (productImage?.asset?._ref) {
    return (
      <div ref={stageRef} className={cn('relative overflow-hidden rounded-sm', className)}>
        <Image
          id={productImage.asset._ref}
          alt={productImage.alt || product.title || ''}
          className="h-full w-full object-cover"
          width={800}
          height={1000}
          mode="cover"
          hotspot={productImage.hotspot}
          crop={productImage.crop}
          preview={productImage.lqip ?? undefined}
        />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        ref={stageRef}
        className={cn('relative overflow-hidden rounded-sm bg-black/5 dark:bg-white/5', className)}
        aria-hidden="true"
      />
    )
  }

  return (
    <div ref={stageRef} className={cn('relative overflow-hidden rounded-sm', className)}>
      {items.map((item, i) => {
        const img = item.mainImage
        if (!img?.asset?._ref) return null
        return (
          <div
            key={item._id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{opacity: i === index ? 1 : 0}}
          >
            <Image
              id={img.asset._ref}
              alt={item.title || product.title || ''}
              className="h-full w-full object-cover"
              width={800}
              height={1000}
              mode="cover"
              hotspot={img.hotspot}
              crop={img.crop}
              preview={img.lqip ?? undefined}
            />
          </div>
        )
      })}
      {cyclingEnabled && (
        <div className="absolute inset-x-0 top-0 z-10 h-1 bg-black/20 dark:bg-white/20">
          <div
            className="h-full bg-black dark:bg-white"
            style={{width: `${Math.min(1, Math.max(0, progress)) * 100}%`}}
          />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop layout                                                     */
/* ------------------------------------------------------------------ */

function DesktopLayout({products}: {products: ValidProduct[]}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const activeProduct = products[activeIndex]

  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(containerRef, {once: true, amount: 0.3})

  const handleSelect = (index: number) => {
    setActiveIndex(index)
  }

  const getTitleColor = (i: number) => {
    const isHovering = hoveredIndex !== null
    const isFocused = isHovering ? hoveredIndex === i : activeIndex === i
    if (isFocused) return 'text-black dark:text-white'
    return 'text-black/25 dark:text-white/25'
  }

  return (
    <motion.div
      ref={containerRef}
      className="hidden lg:grid grid-cols-3 gap-10 flex-1"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {/* Col 1: product titles */}
      <div className="flex flex-col justify-center">
        <motion.ul className="space-y-3" variants={reduceMotion ? undefined : listStaggerVariants}>
          {products.map((product, i) => (
            <motion.li key={product._id} variants={reduceMotion ? undefined : titleEntryVariants}>
              <button
                type="button"
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  'text-2xl md:text-3xl  2xl:text-5xl',
                  'block text-left font-semibold leading-[1.1] tracking-tight transition-colors duration-300',
                  getTitleColor(i),
                )}
              >
                {product.title}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Col 2: image */}
      <motion.div
        className="relative flex items-center justify-center"
        variants={reduceMotion ? undefined : imageRevealVariants}
      >
        <FeaturedProjectsStage
          product={activeProduct}
          enabled={!reduceMotion}
          className="w-[320px] aspect-4/5"
        />
      </motion.div>

      {/* Col 3: excerpt */}
      <div className="flex items-center ps-6 pe-2">
        <AnimatePresence mode="wait">
          {activeProduct && (
            <motion.div
              key={activeProduct._id}
              variants={excerptVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeProduct.excerpt && (
                <p className="text-base leading-relaxed text-black/80 dark:text-white/80">
                  {activeProduct.excerpt}
                </p>
              )}
              {activeProduct.slug && activeProduct.categorySlug && (
                <div className="mt-6">
                  <ArrowButton
                    href={productPath(activeProduct.categorySlug, activeProduct.slug)}
                    variant="primary"
                  >
                    Learn more
                  </ArrowButton>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile layout                                                      */
/* ------------------------------------------------------------------ */

function MobileLayout({products}: {products: ValidProduct[]}) {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  return (
    <section ref={sectionRef} className="lg:hidden">
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className="flex gap-10 px-5 lg:px-10">
          {products.map((product) => (
            <article
              key={product._id}
              className="flex flex-col gap-5 shrink-0 w-[calc(100%-3.5rem)] sm:w-[calc((100%-1.75rem)/1.5)] md:w-[calc((100%-5rem)/1.5)]"
            >
              <FeaturedProjectsStage
                product={product}
                enabled={!reduceMotion}
                className="aspect-square w-full"
              />
              <div className="space-y-4">
                {product.slug && product.categorySlug ? (
                  <ArrowLink href={productPath(product.categorySlug, product.slug)}>
                    <h3 className="text-xl font-semibold leading-[1.1] tracking-tight">
                      {product.title}
                    </h3>
                  </ArrowLink>
                ) : (
                  <h3 className="text-xl font-semibold leading-[1.1] tracking-tight">
                    {product.title}
                  </h3>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
