import BigText from '../../ui/BigText'
import SplitLines from '../../ui/SplitLines'

type Props = {
  headline?: string | null
  text?: string | null
}

export default function ContentSectionBlock({headline, text}: Props) {
  const hasHeadline = Boolean(headline?.trim())
  const hasText = Boolean(text?.trim())
  if (!hasHeadline && !hasText) return null

  return (
    <div className="py-10 2xl:py-20 flex flex-col gap-6">
      {hasHeadline && (
        <BigText as="h2">
          <SplitLines text={headline!} />
        </BigText>
      )}
      {hasText && (
        <p className="mx-auto 2xl:max-w-[75ch] text-center text-base md:text-lg leading-relaxed">
          <SplitLines text={text!} />
        </p>
      )}
    </div>
  )
}
