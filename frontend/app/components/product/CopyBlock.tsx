import {cn} from '@/app/lib/utils'
import TextReveal from '../ui/TextReveal.client'

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
      {headlineVisible && headline ? <TextReveal text={headline} /> : null}
    </div>
  )
}
