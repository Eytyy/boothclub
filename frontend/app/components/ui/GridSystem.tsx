import type {ComponentPropsWithoutRef, ElementType, ReactNode} from 'react'

import {cn} from '@/app/lib/utils'

const GRID_COLUMNS = 12

/** Spans that sum to 12. Vertical rules are drawn on the boundaries between them. */
export type GridColumnLayout = readonly (2 | 3 | 4 | 6 | 7 | 8 | 9 | 12)[]

const ruleStops = (columns: 'none' | GridColumnLayout) => {
  if (columns === 'none') return []

  const stops: number[] = []
  let cursor = 0
  for (let index = 0; index < columns.length - 1; index++) {
    cursor += columns[index]
    if (cursor > 0 && cursor < GRID_COLUMNS) stops.push(cursor)
  }
  return stops
}

export const GridContainer = ({
  children,
  className,
  columns = [6, 6],
}: {
  children: ReactNode
  className?: string
  /**
   * Where full-height vertical rules sit.
   * `[6, 6]` is a center rule, `[4, 4, 4]` and `[3, 3, 3, 3]` split into equal columns,
   * `[8, 4]` sits the rule after an 8-span column. `none` draws no rules.
   */
  columns?: 'none' | GridColumnLayout
}) => {
  const stops = ruleStops(columns)
  // Halves stay in normal stacking so a full-width cell can still cover the center rule.
  // Other splits sit above sticky column backgrounds so the rule remains visible.
  const raised =
    columns !== 'none' && !(columns.length === 2 && columns[0] === 6 && columns[1] === 6)

  return (
    <div
      data-page-grid
      className={cn('pt-13 lg:pt-0 grid grid-cols-12 border-x-site lg:mx-10 relative', className)}
    >
      {children}
      {stops.map((stop) => (
        <span
          key={stop}
          aria-hidden
          className={cn(
            'hidden lg:grid-divider lg:block pointer-events-none absolute top-0 h-full w-(--border-width-site) -translate-x-1/2 bg-black dark:bg-white',
            raised && 'z-110',
          )}
          style={{left: `${(stop / GRID_COLUMNS) * 100}%`}}
        />
      ))}
    </div>
  )
}

type GridBlockOwnProps = {
  children?: ReactNode
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
}

/**
 * `as` is its own intersection member so TypeScript infers the element from
 * that prop. Nesting it with the other props makes the generic fall back to
 * the default `"div"`, and every custom component then fails to type-check.
 */
type GridBlockProps<T extends ElementType> = GridBlockOwnProps & {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, keyof GridBlockOwnProps | 'as'>

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
    'border-s-site border-black dark:border-white': borders === 'left',
    'border-e-site border-black dark:border-white': borders === 'right',
    'border-t-site border-s-site border-black dark:border-white': borders === 'top-left',
    'border-t-site border-e-site border-black dark:border-white': borders === 'top-right',
    'border-b-site border-s-site border-black dark:border-white': borders === 'bottom-left',
    'border-b-site border-e-site border-black dark:border-white': borders === 'bottom-right',
    'border-y-site border-black dark:border-white': borders === 'y',
    'border-x-site border-black dark:border-white': borders === 'x',
  })
  return (
    <Component className={cn(borderClasses, 'p-5 lg:p-10 block', className)} {...props}>
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
  span?: 'full' | 2 | 3 | 4 | 6 | 7 | 8 | 9
}) {
  const spanClasses = cn({
    'lg:col-span-full': span === 'full',
    'lg:col-span-2': span === 2,
    'lg:col-span-3': span === 3,
    'lg:col-span-4': span === 4,
    'lg:col-span-6': span === 6,
    'lg:col-span-7': span === 7,
    'lg:col-span-8': span === 8,
    'lg:col-span-9': span === 9,
  })
  return <div className={cn('col-span-full', spanClasses, className)}>{children}</div>
}
