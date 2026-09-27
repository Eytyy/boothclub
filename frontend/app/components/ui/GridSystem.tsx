import type {ComponentPropsWithoutRef, ElementType, ReactNode} from 'react'

import {cn} from '@/app/lib/utils'

export const GridContainer = ({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode
  variant?: 'default' | 'compact'
  className?: string
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-12 border-x-site mx-10 after:content-[''] after:block after:h-full after:w-(--border-width-site) after:bg-black dark:after:bg-white after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 relative min-h-svh",
        variant === 'compact' ? 'min-h-0' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

type GridBlockOwnProps<T extends ElementType> = {
  children: ReactNode
  className?: string
  borders?:
    | 'none'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'y'
    | 'x'
  as?: T
}

type GridBlockProps<T extends ElementType> = GridBlockOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof GridBlockOwnProps<T>>

export function GridBlock<T extends ElementType = 'div'>({
  children,
  className,
  borders = 'none',
  as,
  ...props
}: GridBlockProps<T>) {
  const Component = as ?? 'div'
  const borderClasses = cn({
    'border-t-site border-black dark:border-white': borders === 'top',
    'border-b-site border-black dark:border-white': borders === 'bottom',
    'border-l-site border-black dark:border-white': borders === 'left',
    'border-r-site border-black dark:border-white': borders === 'right',
    'border-t-site border-l-site border-black dark:border-white': borders === 'top-left',
    'border-t-site border-r-site border-black dark:border-white': borders === 'top-right',
    'border-b-site border-l-site border-black dark:border-white': borders === 'bottom-left',
    'border-b-site border-r-site border-black dark:border-white': borders === 'bottom-right',
    'border-y-site border-black dark:border-white': borders === 'y',
    'border-x-site border-black dark:border-white': borders === 'x',
  })
  return (
    <Component className={cn('p-10 block', borderClasses, className)} {...props}>
      {children}
    </Component>
  )
}

export function GridColumn({
  children,
  className,
  span = 6,
}: {
  children: ReactNode
  className?: string
  span?: 'full' | 2 | 3 | 4 | 6
}) {
  const spanClasses = cn({
    'col-span-full': span === 'full',
    'col-span-2': span === 2,
    'col-span-3': span === 3,
    'col-span-4': span === 4,
    'col-span-6': span === 6,
  })
  return <div className={cn(spanClasses, className)}>{children}</div>
}
