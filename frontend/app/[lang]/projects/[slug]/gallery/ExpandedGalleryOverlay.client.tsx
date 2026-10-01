'use client'

import type {RefObject} from 'react'
import {createPortal} from 'react-dom'
import {motion} from 'framer-motion'

import {cn} from '@/app/lib/utils'
import {COVER_SIZE, FALLBACK_SIZE, toggleButtonClassName} from './constants'
import GalleryPhoto from './GalleryPhoto'
import type {FrameRect, FrameTransition, ProjectGalleryItem} from './types'

type ExpandedGalleryOverlayProps = {
  items: ProjectGalleryItem[]
  currentItem: ProjectGalleryItem
  originRect: FrameRect | null
  frameRect: FrameRect | null
  isExpanded: boolean
  showCover: boolean
  canScroll: boolean
  frameTransition: FrameTransition
  targetRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  onAnimationComplete: () => void
}

export default function ExpandedGalleryOverlay({
  items,
  currentItem,
  originRect,
  frameRect,
  isExpanded,
  showCover,
  canScroll,
  frameTransition,
  targetRef,
  onClose,
  onAnimationComplete,
}: ExpandedGalleryOverlayProps) {
  return createPortal(
    <div className="fixed inset-0 z-30">
      <motion.div
        className="absolute inset-0 bg-white dark:bg-black"
        initial={{opacity: 0}}
        animate={{opacity: isExpanded ? 1 : 0}}
        transition={frameTransition}
      />
      {originRect && frameRect ? (
        <motion.div
          className="fixed overflow-hidden bg-white dark:bg-black"
          initial={originRect}
          animate={frameRect}
          transition={frameTransition}
          onAnimationComplete={onAnimationComplete}
          role="dialog"
          aria-modal="true"
          aria-label="Project gallery"
        >
          <div
            className={cn(
              'absolute inset-0 z-10 transition-opacity duration-200',
              showCover ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <GalleryPhoto item={currentItem} width={COVER_SIZE} height={COVER_SIZE} />
          </div>
          <ExpandedPhotoList items={items} canScroll={canScroll} />
        </motion.div>
      ) : null}
      <div className="pointer-events-none absolute inset-0">
        <div className="container h-full">
          <div className="relative mx-10 h-svh border-x-site border-black dark:border-white">
            <button
              type="button"
              className={`${toggleButtonClassName} end-5`}
              aria-expanded={true}
              aria-label="Collapse gallery"
              onClick={onClose}
            >
              <span aria-hidden="true">–</span>
            </button>
            <div ref={targetRef} className="absolute inset-10" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ExpandedPhotoList({
  items,
  canScroll,
}: {
  items: ProjectGalleryItem[]
  canScroll: boolean
}) {
  return (
    <div
      className={cn('h-full', canScroll ? 'overflow-y-auto overscroll-contain' : 'overflow-hidden')}
      data-lenis-prevent
    >
      <div className="space-y-10">
        {items.map((item) => {
          const width = item.width ?? FALLBACK_SIZE
          const height = item.height ?? FALLBACK_SIZE
          return (
            <div key={item.id} className="w-full" style={{aspectRatio: `${width} / ${height}`}}>
              <GalleryPhoto item={item} width={width} height={height} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
