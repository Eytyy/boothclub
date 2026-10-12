'use client'

import {GridBlock, GridContainer} from '@/app/components/ui/GridSystem'
import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import type {AboutPageQueryResult} from '@/sanity.types'

type TeamMember = NonNullable<NonNullable<AboutPageQueryResult>['teamSection']>['members'][number]

/**
 * A row of names. Hovering a name (or tapping / pressing it) shows that member's
 * picture and role in a card just under it.
 */
export default function TeamMembers({members}: {members: TeamMember[]}) {
  const visibleMembers = members.filter((member) => member.name)
  if (!visibleMembers.length) return null

  return (
    <GridContainer columns={[4, 4, 4]}>
      {visibleMembers.map((member) => {
        return (
          <GridBlock as="li" key={member._id} className="list-none m-0 p-0 col-span-4 space-y-5">
            {member.image?.asset?._ref ? (
              <div className="aspect-4/5 overflow-hidden">
                <Image
                  id={member.image.asset._ref}
                  alt={member.image.alt ?? member.name ?? ''}
                  width={480}
                  height={600}
                  mode="cover"
                  hotspot={member.image.hotspot}
                  crop={member.image.crop}
                  preview={member.image.lqip ?? undefined}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div>
              <h3 className="text-lg lg:text-2xl font-bold uppercase tracking-tight">
                {member.name}
              </h3>
              {member.role ? (
                <p className="text-sm text-black/60 dark:text-white/60">{member.role}</p>
              ) : null}
            </div>
          </GridBlock>
        )
      })}
    </GridContainer>
  )
}
