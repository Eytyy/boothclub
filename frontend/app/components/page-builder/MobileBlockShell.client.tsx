'use client'

import {type ReactNode, type RefObject} from 'react'

import {cn} from '@/app/lib/utils'

type MobileBlockShellProps = {
  children: ReactNode
  className?: string
  animatePadding?: boolean
  scrollRef?: RefObject<HTMLElement | null>
}

export default function MobileBlockShell({children, className, scrollRef}: MobileBlockShellProps) {
  const targetRef = scrollRef

  return (
    <section ref={targetRef} className={cn('pt-20 lg:pt-0', className)}>
      {children}
    </section>
  )
}
