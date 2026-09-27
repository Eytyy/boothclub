import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  as?: 'h2' | 'h3' | 'p'
  className?: string
}

export const sectionTitleClassName =
  'tracking-normal uppercase text-sm font-semibold sm:text-base md:text-lg lg:text-xl xl:text-2xl'

export default function SectionTitle({children, as = 'h2', className}: Props) {
  const Tag = as || 'h2'
  return (
    <Tag
      className={cn(
        sectionTitleClassName,
        'block w-fit items-center gap-2 border-r-site border-b-site px-10 py-5',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
