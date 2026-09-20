import {cn} from '@/app/lib/utils'

const GridContainer = ({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode
  variant?: 'default' | 'compact'
  className?: string
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-12 border-x-4 mx-10 after:content-[''] after:block after:h-full after:w-1 after:bg-black dark:after:bg-white after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 relative min-h-svh",
        variant === 'compact' ? 'min-h-0' : '',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default GridContainer
