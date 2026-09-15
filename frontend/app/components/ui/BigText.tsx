import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export default function BigText({children, as, className}: Props) {
  const Tag = as || 'div'
  return (
    <Tag
      className={cn(
        'text-2xl md:text-4xl  2xl:text-6xl font-bold leading-[1.2] tracking-tight text-center container',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
