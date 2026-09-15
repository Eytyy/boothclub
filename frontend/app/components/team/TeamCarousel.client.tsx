'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {motion, useInView, useReducedMotion, type Variants} from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'

import Image from '@/app/components/ui/SanityImage.client'
import {cn} from '@/app/lib/utils'
import {teamMemberDisplayName, type TeamMemberCardData} from './types'
import {Marquee} from '../ui/Marquee.client'

type ValidMember = TeamMemberCardData & {_id: string}

type Props = {
  members: TeamMemberCardData[]
}

const CYCLE_INTERVAL_MS = 1000

const listStaggerVariants: Variants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.2}},
}

const titleEntryVariants: Variants = {
  hidden: {y: 20, opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {duration: 0.5, ease: [0.22, 1, 0.36, 1]},
  },
}

const imageRevealVariants: Variants = {
  hidden: {opacity: 0, scale: 0},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 0.6, ease: [0.22, 1, 0.36, 1]},
  },
}

function useImageCycle(count: number, paused: boolean) {
  const [index, setIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    clear()
    if (paused || count === 0) return
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % count)
    }, CYCLE_INTERVAL_MS)
    return clear
  }, [paused, count, clear])

  return index
}

function DesktopLayout({members}: {members: ValidMember[]}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const isActive = activeIndex !== null
  const isHovering = hoveredIndex !== null
  const activeMember = isActive ? members[activeIndex] : null

  const listRef = useRef<HTMLUListElement>(null)
  const reduceMotion = useReducedMotion()
  const isInView = useInView(listRef, {once: true, amount: 0.3})

  const cyclePaused = isActive || isHovering
  const cycleIndex = useImageCycle(members.length, cyclePaused)
  const displayedIndex = isActive ? activeIndex : isHovering ? hoveredIndex : cycleIndex

  const handleSelect = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  const getNameColor = (i: number) => {
    const isFocused = hoveredIndex === i || activeIndex === i
    if (!isActive && !isHovering) return 'text-black dark:text-white'
    if (isFocused) return 'text-black dark:text-white'
    return 'text-black/25 dark:text-white/25'
  }

  const activeBio = activeMember?.bio?.trim()

  return (
    <div className="hidden lg:flex justify-center flex-wrap gap-20 flex-1 items-center px-10 py-20">
      {/* Col 1: image + bio under picture */}
      <div className="flex flex-col items-end justify-center">
        <div className="w-[320px] max-w-full overflow-hidden ">
          <motion.div
            className="relative flex w-full flex-col items-center justify-end"
            variants={reduceMotion ? undefined : imageRevealVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="relative w-full aspect-4/5 overflow-hidden rounded-sm">
              {members.map((member, i) => {
                const img = member.picture
                if (!img?.asset?._ref) return null
                return (
                  <div
                    key={member._id}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{opacity: i === displayedIndex ? 1 : 0}}
                  >
                    <Image
                      id={img.asset._ref}
                      alt={img.alt ?? teamMemberDisplayName(member)}
                      className="h-full w-full object-cover"
                      width={800}
                      height={1000}
                      mode="cover"
                      hotspot={img.hotspot ?? undefined}
                      crop={img.crop ?? undefined}
                      preview={img.lqip ?? undefined}
                    />
                  </div>
                )
              })}
            </div>
          </motion.div>
          <div className="mt-4 w-full min-h-16">{activeBio ? <Bio bio={activeBio} /> : null}</div>
        </div>
      </div>

      {/* Col 2: names (right-aligned) */}
      <div className="flex flex-col justify-center col-span-2 relateive -translate-y-8">
        <motion.ul
          ref={listRef}
          className="grid grid-cols-2 gap-x-20 gap-y-4"
          variants={reduceMotion ? undefined : listStaggerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {members.map((member, i) => (
            <motion.li key={member._id} variants={reduceMotion ? undefined : titleEntryVariants}>
              <button
                type="button"
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  'text-2xl md:text-3xl lg:text-4xl',
                  'block w-full text-left font-semibold leading-[1.1] tracking-tight transition-colors duration-300',
                  getNameColor(i),
                )}
              >
                {teamMemberDisplayName(member)}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

function MobileLayout({members}: {members: ValidMember[]}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  const handleSelect = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="lg:hidden">
      <div className="overflow-x-clip" ref={emblaRef}>
        <div className="flex gap-10 px-5 lg:px-10 items-start">
          {members.map((member, i) => {
            const img = member.picture
            const bio = member.bio?.trim()
            const isActive = activeIndex === i
            return (
              <article
                key={member._id}
                className="flex flex-col shrink-0 w-[calc(100%-3.5rem)] sm:w-[calc((100%-1.75rem)/1.5)] md:w-[calc((100%-5rem)/1.5)]"
              >
                <button
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="flex flex-col gap-5 text-left"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-sm">
                    {img?.asset?._ref ? (
                      <Image
                        id={img.asset._ref}
                        alt={img.alt ?? teamMemberDisplayName(member)}
                        className="h-full w-full object-cover"
                        width={800}
                        height={800}
                        mode="cover"
                        hotspot={img.hotspot ?? undefined}
                        crop={img.crop ?? undefined}
                        preview={img.lqip ?? undefined}
                      />
                    ) : null}
                  </div>
                  <h3 className="text-xl font-semibold leading-[1.1] tracking-tight">
                    {teamMemberDisplayName(member)}
                  </h3>
                </button>
                <div className="mt-2 w-full ">{bio && isActive ? <Bio bio={bio} /> : null}</div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const Bio = ({bio}: {bio: string}) => {
  return (
    <Marquee className="h-auto">
      <p className="text-base leading-relaxed text-black/80 dark:text-white/80">{bio}</p>
    </Marquee>
  )
}

export default function TeamCarousel({members}: Props) {
  const validMembers = members.filter((m): m is ValidMember =>
    Boolean(m._id && m.picture?.asset?._ref && teamMemberDisplayName(m)),
  )
  if (!validMembers.length) return null

  return (
    <>
      <DesktopLayout members={validMembers} />
      <MobileLayout members={validMembers} />
    </>
  )
}
