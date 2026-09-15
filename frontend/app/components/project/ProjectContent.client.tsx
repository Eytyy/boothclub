'use client'

import {useId, useMemo, useState, type ReactNode} from 'react'
import {type PortableTextBlock} from 'next-sanity'
import {motion, useReducedMotion} from 'framer-motion'

import PortableText from '@/app/components/ui/PortableText'
import Button from '@/app/components/ui/Button'
import ChevronIcon from '@/app/components/ui/icons/ChevronIcon'

const SPLIT_MARKER = '{{split}}'

function newKey() {
  return `k${Math.random().toString(36).slice(2, 11)}`
}

type SpanChild = {
  _type?: string
  _key: string
  text?: string
  marks?: string[]
}

function findSplitPosition(
  blocks: PortableTextBlock[],
  marker: string,
): {bi: number; ci: number} | null {
  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi]
    if (block._type !== 'block' || !Array.isArray(block.children)) {
      continue
    }
    for (let ci = 0; ci < block.children.length; ci++) {
      const child = block.children[ci] as SpanChild
      if (typeof child.text === 'string' && child.text.includes(marker)) {
        return {bi, ci}
      }
    }
  }
  return null
}

function splitPortableTextAtMarker(
  blocks: PortableTextBlock[],
  marker: string,
): {before: PortableTextBlock[]; after: PortableTextBlock[]} | null {
  const pos = findSplitPosition(blocks, marker)
  if (!pos) return null

  const {bi, ci} = pos
  const block = blocks[bi] as PortableTextBlock & {
    children: SpanChild[]
  }
  const child = block.children[ci]
  const idx = child.text!.indexOf(marker)
  const beforeText = child.text!.slice(0, idx)
  const afterText = child.text!.slice(idx + marker.length)

  const beforeBlocks: PortableTextBlock[] = []
  for (let j = 0; j < bi; j++) {
    beforeBlocks.push(structuredClone(blocks[j]) as PortableTextBlock)
  }

  const beforeChildren: SpanChild[] = []
  for (let j = 0; j < ci; j++) {
    beforeChildren.push(structuredClone(block.children[j]) as SpanChild)
  }
  if (beforeText.length > 0) {
    beforeChildren.push({
      ...structuredClone(child),
      _key: newKey(),
      text: beforeText,
    })
  }

  if (beforeChildren.length > 0) {
    const cloned = structuredClone(block) as PortableTextBlock
    cloned._key = newKey()
    cloned.children = beforeChildren as PortableTextBlock['children']
    beforeBlocks.push(cloned)
  }

  const afterBlocks: PortableTextBlock[] = []
  const afterChildren: SpanChild[] = []
  if (afterText.length > 0) {
    afterChildren.push({
      ...structuredClone(child),
      _key: newKey(),
      text: afterText,
    })
  }
  for (let j = ci + 1; j < block.children.length; j++) {
    afterChildren.push(structuredClone(block.children[j]) as SpanChild)
  }

  if (afterChildren.length > 0) {
    const cloned = structuredClone(block) as PortableTextBlock
    cloned._key = newKey()
    cloned.children = afterChildren as PortableTextBlock['children']
    afterBlocks.push(cloned)
  }

  for (let j = bi + 1; j < blocks.length; j++) {
    afterBlocks.push(structuredClone(blocks[j]) as PortableTextBlock)
  }

  return {before: beforeBlocks, after: afterBlocks}
}

const proseClass = 'prose prose-neutral max-w-none text-balance dark:prose-invert'

export default function ProjectContent({
  title,
  value,
  children,
}: {
  title: ReactNode
  value: PortableTextBlock[] | null | undefined
  children?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const bodyRegionId = useId()
  const prefersReducedMotion = useReducedMotion()

  const split = useMemo(
    () => (value?.length ? splitPortableTextAtMarker(value, SPLIT_MARKER) : null),
    [value],
  )

  const transition = prefersReducedMotion
    ? {duration: 0}
    : {duration: 0.38, ease: [0.25, 0.1, 0.25, 1] as const}

  const hasBody = Boolean(value?.length)
  const hasExpandableBody = Boolean(split && split.after.length > 0)
  const showReadToggle = hasExpandableBody
  const controlsId = hasExpandableBody ? bodyRegionId : undefined

  const collapsedRegionStyle = {
    overflow: 'hidden' as const,
  }

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-10 lg:px-10">
      <div className="@content flex flex-col gap-8 lg:sticky lg:top-6 lg:self-start">
        {title}
        {children}
      </div>

      <div className="flex flex-col gap-4">
        {hasBody && (
          <div className={proseClass}>
            {split ? <PortableText value={split.before} /> : <PortableText value={value!} />}
          </div>
        )}

        {hasExpandableBody && (
          <motion.div
            id={bodyRegionId}
            initial={false}
            animate={{
              height: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={transition}
            style={{
              ...collapsedRegionStyle,
              pointerEvents: expanded ? 'auto' : 'none',
            }}
            aria-hidden={!expanded}
          >
            <div className={proseClass}>
              <PortableText value={split!.after} />
            </div>
          </motion.div>
        )}

        {showReadToggle && (
          <Button
            variant="primary"
            type="button"
            aria-expanded={expanded}
            aria-controls={controlsId}
            onClick={() => setExpanded((e) => !e)}
            className="w-fit"
          >
            {expanded ? 'Read less' : 'Read more'}
            <ChevronIcon className={expanded ? 'rotate-180' : ''} />
          </Button>
        )}
      </div>
    </section>
  )
}
