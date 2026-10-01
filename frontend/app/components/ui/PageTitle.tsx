import {cn} from '@/app/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'p'
  className?: string
}

export default function PageTitle({children, as = 'h1', className}: Props) {
  const Tag = as || 'h1'
  return <Tag className={cn('page-title', className)}>{children}</Tag>
}
