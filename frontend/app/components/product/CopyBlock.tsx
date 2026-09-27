import {cn} from '@/app/lib/utils'

type CopyBlockProps = {
  showHeadline?: boolean
  showText?: boolean
  headline?: string
  text?: string
  className?: string
}

export default function CopyBlock({
  showHeadline,
  showText,
  headline,
  text,
  className,
}: CopyBlockProps) {
  const headlineVisible = Boolean(showHeadline && headline?.trim())
  const textVisible = Boolean(showText && text?.trim())
  if (!headlineVisible && !textVisible) return null

  return (
    <div className={cn('p-10 space-y-5', className)}>
      {headlineVisible ? <h2 className="text-6xl font-bold">{headline}</h2> : null}
      {textVisible ? (
        <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">{text}</p>
      ) : null}
    </div>
  )
}
