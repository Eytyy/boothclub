'use client'

import ParallaxGrid from '@/app/components/ui/ParallaxGrid.client'
import ProjectCard from '@/app/components/project/ProjectCard'
import ProjectTextRow from '@/app/components/project/ProjectTextRow'
import type {ProjectCardData} from '@/app/components/project/types'
import Grid from '@/app/components/ui/Grid'

type ProjectParallaxGridProps = {
  items: ProjectCardData[]
  isFiltered: boolean
  featuredCount: number
}

export default function ProjectParallaxGrid({
  items,
  isFiltered,
  featuredCount,
}: ProjectParallaxGridProps) {
  const cardCount = isFiltered ? 0 : featuredCount
  const featuredItems = items.slice(0, cardCount)
  const textItems = items.slice(cardCount)

  return (
    <>
      <div className="sm:hidden">
        {featuredItems.length > 0 && (
          <div className="grid grid-cols-1 gap-10">
            {featuredItems.map((item, index) => (
              <ProjectCard key={item._id} item={item} index={index} />
            ))}
          </div>
        )}
        {textItems.length > 0 && (
          <ul className={featuredItems.length > 0 ? 'mt-10' : ''}>
            {textItems.map((item) => (
              <li key={item._id}>
                <ProjectTextRow item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden sm:block">
        <Grid
          items={items}
          renderItem={(item, index) => <ProjectCard item={item} index={index} />}
          gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 2xl:gap-10 overflow-x-clip"
        />
      </div>
    </>
  )
}
