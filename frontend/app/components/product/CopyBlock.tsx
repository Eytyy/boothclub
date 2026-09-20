type CopyBlockProps = {
  showHeadline?: boolean
  showText?: boolean
  headline?: string
  text?: string
}

export default function CopyBlock({showHeadline, showText, headline, text}: CopyBlockProps) {
  const headlineVisible = Boolean(showHeadline && headline?.trim())
  const textVisible = Boolean(showText && text?.trim())
  if (!headlineVisible && !textVisible) return null

  return (
    <div className="p-10 pb-0">
      {headlineVisible ? <h2 className="text-6xl font-bold">{headline}</h2> : null}
    </div>
  )
}
