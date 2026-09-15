'use client'

import {useState} from 'react'
import {stegaClean} from '@sanity/client/stega'
import {ExtractPageBuilderType} from '@/sanity/lib/types'
import SectionHeader from '../SectionHeader.client'
import {Marquee} from '../../ui/Marquee.client'
import DotCarousel from '../../ui/DotCarousel.client'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'

type FeaturedClientsProps = {
  block: ExtractPageBuilderType<'featuredClients'>
  index: number
  pageType: string
  pageId: string
}

type FeaturedClientsRowType = ExtractPageBuilderType<'featuredClients'>['rows'][number]
type FeaturedClient = FeaturedClientsRowType['clients'][number]
type LogoImage = FeaturedClient['darkLogo']

type LogoShape = 'wide' | 'square' | 'tall'
type LogoSize = 'sm' | 'md' | 'lg'

const HEIGHT_BY_SIZE: Record<LogoSize, string> = {
  sm: 'h-12 lg:h-20',
  md: 'h-14 lg:h-24',
  lg: 'h-16 lg:h-28',
}

const WIDTH_BY_SHAPE_SIZE: Record<LogoShape, Record<LogoSize, string>> = {
  wide: {sm: 'w-28 lg:w-44', md: 'w-32 lg:w-56', lg: 'w-40 lg:w-72'},
  square: {sm: 'w-16 lg:w-24', md: 'w-20 lg:w-32', lg: 'w-24 lg:w-40'},
  tall: {sm: 'w-10 lg:w-16', md: 'w-12 lg:w-20', lg: 'w-14 lg:w-24'},
}

export default function FeaturedClients({block}: FeaturedClientsProps) {
  const {heading, rows} = block
  const testimonials: Testimonial[] | undefined =
    'testimonials' in block
      ? (block as unknown as {testimonials?: Testimonial[]}).testimonials
      : undefined

  const [activeIndex, setActiveIndex] = useState(0)

  if (!rows?.length) return null

  const safeIndex = Math.min(activeIndex, rows.length - 1)
  const activeRow = rows[safeIndex]
  const showTabs = rows.length > 1

  return (
    <div className="overflow-x-hidden pt-[calc(var(--header-height)+40px)] lg:pb-10 lg:pt-20">
      <div className="lg:px-10">
        <SectionHeader heading={heading} />
      </div>
      <div className="mt-10 lg:mt-20 space-y-5 lg:space-y-10">
        {showTabs && (
          <div className="flex flex-wrap justify-center gap-4 px-4">
            {rows.map((row, i) => {
              return (
                <TabButton
                  key={`tab-${row._key}`}
                  isActive={i === safeIndex}
                  onClick={() => setActiveIndex(i)}
                  label={row.heading ?? `Row ${i + 1}`}
                />
              )
            })}
          </div>
        )}
        <FeaturedClientsRow key={activeRow._key} row={activeRow} rowIndex={safeIndex} />
      </div>
      {testimonials && testimonials.length > 0 && (
        <div className="space-y-5 px-5 pt-10 lg:space-y-10 lg:p-10 lg:pt-20">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      )}
    </div>
  )
}

const TabButton = ({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean
  onClick: () => void
  label: string
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        ' border px-2 lg:px-4 py-1  lg:py-1.5 text-xs lg:text-sm  uppercase transition-colors',
        isActive
          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
          : 'border-black hover:bg-black/5 dark:border-white dark:hover:bg-white/10',
      )}
    >
      {label}
    </button>
  )
}

const FeaturedClientsRow = ({row, rowIndex}: {row: FeaturedClientsRowType; rowIndex: number}) => {
  return (
    <div className="relative">
      <Marquee speed={100} index={rowIndex} className="h-auto">
        <div className="flex items-center gap-10 lg:gap-20 text-4xl font-semibold">
          {row.clients.map((client, i) => (
            <LogoPlaceholder
              key={`${client._id}-${i}`}
              name={client.name}
              darkLogo={client.darkLogo}
              lightLogo={client.lightLogo}
              shape={(stegaClean(client.shape) as LogoShape | undefined) ?? 'wide'}
              displaySize={(stegaClean(client.displaySize) as LogoSize | undefined) ?? 'md'}
            />
          ))}
        </div>
      </Marquee>
    </div>
  )
}

type LogoPlaceholderProps = {
  name: string | null
  darkLogo?: LogoImage
  lightLogo?: LogoImage
  shape: LogoShape
  displaySize: LogoSize
}

const LogoPlaceholder = ({name, darkLogo, lightLogo, shape, displaySize}: LogoPlaceholderProps) => {
  const hasDark = !!darkLogo?.asset?._ref
  const hasLight = !!lightLogo?.asset?._ref
  const boxClass = cn(
    'flex items-center justify-center',
    HEIGHT_BY_SIZE[displaySize],
    WIDTH_BY_SHAPE_SIZE[shape][displaySize],
  )

  if (!hasDark && !hasLight) {
    if (!name) return null
    return <div className={boxClass}>{name.slice(0, 2)}</div>
  }

  return (
    <div className={boxClass}>
      {hasDark && (
        <Image
          id={darkLogo!.asset!._ref!}
          alt={name ?? ''}
          height={256}
          className={cn(
            'h-auto max-h-full w-auto max-w-full object-contain',
            hasLight ? 'block dark:hidden' : 'block',
          )}
        />
      )}
      {hasLight && (
        <Image
          id={lightLogo!.asset!._ref!}
          alt={name ?? ''}
          height={256}
          className={cn(
            'h-auto max-h-full w-auto max-w-full object-contain',
            hasDark ? 'hidden dark:block' : 'block',
          )}
        />
      )}
    </div>
  )
}

type Testimonial = {
  _id: string
  quote: string | null
  name: string | null
  company: string | null
}

function TestimonialsCarousel({testimonials}: {testimonials: Testimonial[]}) {
  return (
    <DotCarousel>
      {testimonials.map((testimonial, index) =>
        testimonial?.quote ? (
          <TestimonialCard testimonial={testimonial} key={`${testimonial._id}-${index}`} />
        ) : null,
      )}
    </DotCarousel>
  )
}

function TestimonialCard({testimonial}: {testimonial: Testimonial}) {
  return (
    <blockquote className="max-w-2xl space-y-4 text-center select-none cursor-grab active:cursor-grabbing">
      <p className="text-lg lg:text-xl leading-relaxed ">&ldquo;{testimonial.quote}&rdquo;</p>
      <footer className="text-sm">
        {testimonial.name && <div className="font-semibold">{testimonial.name}</div>}
        {testimonial.company && (
          <div className="text-black/50 dark:text-white/50">{testimonial.company}</div>
        )}
      </footer>
    </blockquote>
  )
}
