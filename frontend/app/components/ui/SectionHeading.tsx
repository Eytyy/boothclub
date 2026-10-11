import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  as?: 'h2' | 'h3'
  className?: string
}

export default function SectionHeading({children, as = 'h2', className}: Props) {
  const Tag = as
  return (
    <Tag
      className={cn(
        'text-lg font-semibold uppercase p-5 lg:p-10 pb-0 lg:pb-0 flex items-center gap-5',
        className,
      )}
    >
      <span className="block w-4 h-4 bg-black dark:bg-white" aria-hidden />
      {children}
    </Tag>
  )
}
