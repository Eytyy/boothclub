import MediaItem from '@/app/components/page-builder/blocks/MediaItem.client'
import type {CareersPageQueryResult} from '@/sanity.types'
import BigText from '../ui/BigText'
import SplitLines from '../ui/SplitLines'

type MainImage = NonNullable<NonNullable<CareersPageQueryResult>['mainImage']>

type CareersIntroProps = {
  intro: string | null
  mainImage: MainImage | null
}

export default function CareersIntro({intro, mainImage}: CareersIntroProps) {
  if (!intro && !mainImage?.asset?._ref) return null

  return (
    <section>
      {intro ? (
        <BigText as="p" className="py-20">
          <SplitLines text={intro} />
        </BigText>
      ) : null}
      <div>
        {mainImage?.asset?._ref ? (
          <div className="w-full px-5 lg:px-10">
            <MediaItem media={{type: 'image', image: mainImage}} aspect="video" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
