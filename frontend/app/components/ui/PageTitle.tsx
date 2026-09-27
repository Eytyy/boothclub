import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'p'
  className?: string
  variant?: 'default' | 'large'
}

export default function PageTitle({children, as = 'h1', className, variant = 'default'}: Props) {
  const Tag = as || 'h1'
  return (
    <Tag
      className={cn(
        variant === 'large'
          ? 'text-6xl font-bold  '
          : 'text-xl font-medium leading-[0.9] tracking-tight ',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
