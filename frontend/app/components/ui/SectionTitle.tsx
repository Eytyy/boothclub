import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  as?: 'h2' | 'h3' | 'p'
  className?: string
}

export default function SectionTitle({children, as = 'h2', className}: Props) {
  const Tag = as || 'h2'
  return (
    <Tag
      className={cn(
        'text-2xl md:text-4xl leading-[1.2] tracking-tight 2xl:text-6xl font-bold text-center 2xl:max-w-[36ch] mx-auto uppercase mb-5 lg:mb-10',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
