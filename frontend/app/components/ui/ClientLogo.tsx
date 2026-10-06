import {stegaClean} from '@sanity/client/stega'

import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'

type LogoImage = {asset?: {_ref?: string | null} | null} | null | undefined

type LogoShape = 'wide' | 'square' | 'tall'
type LogoSize = 'sm' | 'md' | 'lg'

const HEIGHT_BY_SIZE: Record<LogoSize, string> = {
  sm: 'h-12 lg:h-20',
  md: 'h-14 lg:h-24',
  lg: 'h-16 lg:h-28',
}

const WIDTH_BY_SHAPE_SIZE: Record<LogoShape, Record<LogoSize, string>> = {
  wide: {sm: 'w-28 lg:w-44', md: 'w-32 lg:w-56', lg: 'w-40 lg:w-72'},
  square: {sm: 'w-16 lg:w-24', md: 'w-20 lg:w-32', lg: 'w-24 lg:w-40'},
  tall: {sm: 'w-10 lg:w-16', md: 'w-12 lg:w-20', lg: 'w-14 lg:w-24'},
}

export type ClientLogoData = {
  name: string | null
  darkLogo?: LogoImage
  lightLogo?: LogoImage
  shape?: string | null
  displaySize?: string | null
}

/**
 * Dark logo on the light theme, light logo on the dark theme. Falls back to whichever
 * exists, then to the client's name as text.
 */
export default function ClientLogo({
  name,
  darkLogo,
  lightLogo,
  shape,
  displaySize,
}: ClientLogoData) {
  const darkRef = darkLogo?.asset?._ref
  const lightRef = lightLogo?.asset?._ref

  if (!darkRef && !lightRef) {
    if (!name) return null
    return <span className="whitespace-nowrap">{name}</span>
  }

  const logoShape = (stegaClean(shape) as LogoShape | null) ?? 'wide'
  const logoSize = (stegaClean(displaySize) as LogoSize | null) ?? 'md'
  const imageClass = 'h-auto max-h-full w-auto max-w-full object-contain'

  return (
    <div
      className={cn(
        'flex items-center justify-center',
        HEIGHT_BY_SIZE[logoSize] ?? HEIGHT_BY_SIZE.md,
        WIDTH_BY_SHAPE_SIZE[logoShape]?.[logoSize] ?? WIDTH_BY_SHAPE_SIZE.wide.md,
      )}
    >
      {darkRef && (
        <Image
          id={darkRef}
          alt={name ?? ''}
          height={256}
          className={cn(imageClass, lightRef ? 'block dark:hidden' : 'block')}
        />
      )}
      {lightRef && (
        <Image
          id={lightRef}
          alt={name ?? ''}
          height={256}
          className={cn(imageClass, darkRef ? 'hidden dark:block' : 'block')}
        />
      )}
    </div>
  )
}
