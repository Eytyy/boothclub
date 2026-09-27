import {Marquee} from '@/app/components/ui/Marquee.client'
import {cn} from '@/app/lib/utils'

import {sectionTitleClassName} from './SectionTitle'

type Props = {
  children: string
  as?: 'h2' | 'h3' | 'p'
  className?: string
  speed?: number
}

export default function SectionTitleMarquee({children, as = 'h2', className, speed = 48}: Props) {
  return (
    <Marquee
      as={as}
      accessibleText={children}
      speed={speed}
      runClassName="mx-0"
      className={cn('h-auto opacity-50', className)}
    >
      <span
        className={cn(
          sectionTitleClassName,
          'inline-block whitespace-nowrap px-10 py-5 font-normal',
        )}
      >
        {children}
      </span>
    </Marquee>
  )
}
