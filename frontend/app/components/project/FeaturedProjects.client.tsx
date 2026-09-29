'use client'

import type {ProjectCardData, ProjectCardImage} from '@/app/components/project/types'
import Button from '@/app/components/ui/Button'
import OverlayArrowButton from '@/app/components/ui/OverlayArrowButton.client'
import SectionTitle from '@/app/components/ui/SectionTitle'
import SpotlightCaption from '@/app/components/ui/SpotlightCaption'
import SquareMediaStage from '@/app/components/ui/SquareMediaStage'
import {cn} from '@/app/lib/utils'
import {useEffect, useMemo, useState} from 'react'

import {GridBlock} from '../ui/GridSystem'
import {Locale} from '@/app/lib/i18n/config'
import ArrowIcon from '../ui/icons/ArrowIcon'

const SHUFFLE_INTERVAL_MS = 1000

type ProjectFrame = NonNullable<ProjectCardImage>

function getProjectFrames(item: ProjectCardData): ProjectFrame[] {
  const frames: ProjectFrame[] = []
  const seen = new Set<string>()

  const add = (image: ProjectCardImage | undefined) => {
    const ref = image?.asset?._ref
    if (!image || !ref || seen.has(ref)) return
    seen.add(ref)
    frames.push(image)
  }

  add(item.mainImage)
  item.gallery?.forEach(add)
  return frames
}

export default function FeaturedProjects({
  items,
  heading = 'Featured Projects',
  className,
  lang,
}: {
  items: ProjectCardData[]
  heading?: string
  className?: string
  lang: Locale
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [frameIndex, setFrameIndex] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  const activeItem = items.length === 0 ? undefined : items[activeIndex % items.length]
  const frames = useMemo(() => (activeItem ? getProjectFrames(activeItem) : []), [activeItem])

  useEffect(() => {
    if (frames.length <= 1) return
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % frames.length)
    }, SHUFFLE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [frames.length, cycleKey])

  if (!activeItem) {
    return null
  }

  const displayImage = frames[frameIndex] ?? frames[0]
  const {title, product, slug} = activeItem
  const showArrows = items.length > 1

  const stepProject = (direction: 1 | -1) => {
    setActiveIndex((index) => (index + direction + items.length) % items.length)
    setFrameIndex(0)
    setCycleKey((key) => key + 1)
  }

  return (
    <div className={cn('border-b-site border-black dark:border-white', className)}>
      <SectionTitle>{heading}</SectionTitle>
      <GridBlock className="grid grid-rows-[min-content_1fr] pb-0">
        <SpotlightCaption title={title} detail={product?.title} />
        <SquareMediaStage href={`/projects/${slug}`} label={`View ${title}`} image={displayImage}>
          {showArrows ? (
            <>
              <OverlayArrowButton
                direction="next"
                label="Next project"
                onClick={() => stepProject(1)}
              />
              <OverlayArrowButton
                direction="prev"
                label="Previous project"
                onClick={() => stepProject(-1)}
              />
            </>
          ) : null}
        </SquareMediaStage>
      </GridBlock>
      <div className="flex justify-end">
        <Button href="/projects">
          <span className="flex items-center gap-2">
            {lang === 'ar' ? 'جميع المشاريع' : 'all projects'} <ArrowIcon lang={lang} />
          </span>
        </Button>
      </div>
    </div>
  )
}
