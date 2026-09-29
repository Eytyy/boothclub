'use client'

import {useState} from 'react'

import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {AllPostsQueryResult} from '@/sanity.types'
import {Post} from './Post'
import DateComponent from '@/app/components/ui/Date'

type YearGroup = {
  year: number
  posts: AllPostsQueryResult
}

type Props = {
  groups: YearGroup[]
  currentYear: number
}

export default function YearGroupedPosts({groups, currentYear}: Props) {
  const [expandedYears, setExpandedYears] = useState<Set<number>>(() => new Set([currentYear]))

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev)
      if (next.has(year)) {
        next.delete(year)
      } else {
        next.add(year)
      }
      return next
    })
  }

  return (
    <div className="space-y-12">
      {groups.map(({year, posts}) => {
        const isExpanded = expandedYears.has(year)
        const sectionId = `year-${year}`

        return (
          <section key={year} aria-labelledby={sectionId}>
            <button
              id={sectionId}
              aria-expanded={isExpanded}
              aria-controls={`${sectionId}-content`}
              onClick={() => toggleYear(year)}
              className="flex items-center gap-3 w-full text-left mb-3 lg:mb-6 group"
            >
              <span className="text-2xl lg:text-3xl font-light">{year}</span>
              <span
                className="ml-auto text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-transform duration-200"
                style={{transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'}}
                aria-hidden="true"
              >
                ↓
              </span>
            </button>

            <div id={`${sectionId}-content`}>
              {isExpanded ? (
                <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {posts.map((post) => (
                    <Post key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <ul className="divide-y divide-black/10 dark:divide-white/10">
                  {posts
                    .filter((post): post is (typeof posts)[number] & {title: string; slug: string} =>
                      Boolean(post.title && post.slug),
                    )
                    .map((post) => (
                      <li
                        key={post._id}
                        className="py-4 lg:py-2 flex flex-col-reverse lg:flex-row items-baseline justify-between gap-2 lg:gap-4"
                      >
                        <LocalizedLink
                          href={`/blog/${post.slug}`}
                          className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:underline transition-colors text-sm"
                        >
                          {post.title}
                        </LocalizedLink>
                        <time
                          dateTime={post.date ?? undefined}
                          className="text-black/40 dark:text-white/40 text-xs shrink-0"
                        >
                          <DateComponent dateString={post.date ?? undefined} />
                        </time>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
