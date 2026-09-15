import type {ExtractPageBuilderType} from '@/sanity/lib/types'
import SanityCtaButton from '@/app/components/ui/SanityCtaButton'
import {hasSanityCta} from '@/app/lib/sanity/button'
import BigText from '../../ui/BigText'
import PageTitle from '../../ui/PageTitle'
import SplitLines from '../../ui/SplitLines'

type Props = {
  block: ExtractPageBuilderType<'cta'>
}

export default function CtaBlock({block}: Props) {
  const {headline, tagline, button} = block
  if (!headline?.trim()) return null

  return (
    <section className="text-center my-20">
      <header className="flex flex-col gap-10">
        <PageTitle as="h2">{headline}</PageTitle>
        {tagline?.trim() && (
          <BigText as="p">
            <SplitLines text={tagline} />
          </BigText>
        )}
      </header>
      {hasSanityCta(button) && (
        <div className="mt-10 flex justify-center">
          <SanityCtaButton cta={button} />
        </div>
      )}
    </section>
  )
}
