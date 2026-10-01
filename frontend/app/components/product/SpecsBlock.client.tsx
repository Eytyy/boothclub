'use client'

import {useState} from 'react'
import TextReveal from '@/app/components/ui/TextReveal.client'

type SpecItem = {
  _key: string
  text: string
}

type SpecsBlockProps = {
  items?: SpecItem[]
  className?: string
}

function SpecLine({
  item,
  unlocked,
  onComplete,
}: {
  item: SpecItem
  unlocked: boolean
  onComplete: () => void
}) {
  return (
    <li className="select-none">
      <TextReveal
        text={item.text}
        animationKey={item._key}
        active={unlocked}
        onComplete={onComplete}
        variant="compact"
      />
    </li>
  )
}

export default function SpecsBlock({items}: SpecsBlockProps) {
  const [unlockedIndex, setUnlockedIndex] = useState(0)

  if (!items?.length) return null
  return (
    <div className="p-10 space-y-10">
      <ul className="space-y-5">
        {items.map((item, index) => (
          <SpecLine
            key={item._key}
            item={item}
            unlocked={index <= unlockedIndex}
            onComplete={() => setUnlockedIndex((current) => Math.max(current, index + 1))}
          />
        ))}
      </ul>
    </div>
  )
}
