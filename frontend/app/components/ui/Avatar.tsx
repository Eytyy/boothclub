import Image from './SanityImage.client'
import DateComponent from './Date'

type Props = {
  person: {
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    picture?: {
      asset?: {_ref: string}
      hotspot?: {x?: number; y?: number}
      crop?: {top?: number; bottom?: number; left?: number; right?: number}
      alt?: string | null
      lqip?: string | null
    } | null
  }
  date?: string
  small?: boolean
}

export default function Avatar({person, date, small = false}: Props) {
  const {name, firstName, lastName, picture} = person
  const displayName = name || [firstName, lastName].filter(Boolean).join(' ')

  return (
    <div className="flex items-center font-mono">
      {picture?.asset?._ref ? (
        <div className={`${small ? 'h-6 w-6 mr-2' : 'h-9 w-9 mr-4'}`}>
          <Image
            id={picture.asset._ref}
            alt={picture?.alt || ''}
            className="h-full rounded-full"
            height={small ? 32 : 48}
            width={small ? 32 : 48}
            hotspot={picture.hotspot}
            crop={picture.crop}
            preview={picture.lqip ?? undefined}
            mode="cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col">
        {displayName && <div className={`${small ? 'text-sm' : ''}`}>{displayName}</div>}
        <div className={`text-black/50 dark:text-white/50 ${small ? 'text-xs' : 'text-sm'}`}>
          <DateComponent dateString={date} />
        </div>
      </div>
    </div>
  )
}
