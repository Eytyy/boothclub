'use client'

import AnimatedWords from '@/app/components/ui/AnimatedWords.client'
import BigText from '@/app/components/ui/BigText'
import ArrowButton from '@/app/components/ui/ArrowButton'
import ProjectCarousel from '@/app/components/project/ProjectCarousel.client'
import {ProjectCardData} from '@/app/components/project/types'
import {useDictionary} from '@/app/lib/i18n/LocaleProvider.client'
import SectionTitle from '@/app/components/ui/SectionTitle'
import SectionTitleMarquee from '@/app/components/ui/SectionTitleMarquee'

export default function FeaturedProjects({
  items,
  tagline,
}: {
  items: ProjectCardData[]
  tagline?: string
}) {
  const t = useDictionary()

  return (
    <ProjectCarousel
      items={items}
      header={
        tagline ? (
          <SectionTitle as="h2" className="px-5 lg:px-10  mx-auto">
            {tagline}
          </SectionTitle>
        ) : null
      }
      cta={<ArrowButton href="/projects">{t['actions.allWork']}</ArrowButton>}
    />
  )
}
