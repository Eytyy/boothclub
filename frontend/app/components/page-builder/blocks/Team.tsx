import TeamCarousel from '@/app/components/team/TeamCarousel.client'
import {ExtractPageBuilderType} from '@/sanity/lib/types'
import LocalizedText from '@/app/lib/i18n/LocalizedText.client'
import BigText from '../../ui/BigText'
import SplitLines from '../../ui/SplitLines'
import ArrowButton from '../../ui/ArrowButton'

type TeamProps = {
  block: ExtractPageBuilderType<'team'>
  index: number
  pageType: string
  pageId: string
}

export default function Team({block}: TeamProps) {
  const {heading, members} = block

  if (!members?.length) return null

  return (
    <section className="relative flex flex-col lg:py-20 gap-10">
      {heading ? (
        <BigText as="h2">
          <SplitLines text={heading} />
        </BigText>
      ) : null}
      <TeamCarousel members={members} />
      <ArrowButton className="mx-auto" href="/careers">
        <LocalizedText k="actions.joinTheTeam" />
      </ArrowButton>
    </section>
  )
}
