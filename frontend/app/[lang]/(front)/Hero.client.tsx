'use client'
import TextReveal from '@/app/components/ui/TextReveal.client'
import {motion} from 'framer-motion'

type Props = {}

const mediaBlocks = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, 31, 32,
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
}

export default function HomeHero({}: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-8 relative text-white"
    >
      {mediaBlocks.map((block) => (
        <MediaBlock key={block} count={block} />
      ))}
      <TextReveal
        className="pointer-events-none absolute inset-0 text-white page-title flex items-center justify-center px-10"
        text={'Photo experiences brands build launches around.'}
      />
    </motion.div>
  )
}

const mediaBlockVariants = {
  hidden: {scale: 0},
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      bounce: 0.5,
      visualDuration: 0.45,
    },
  },
}

const MediaBlock = ({count}: {count: number}) => {
  return (
    <motion.div
      variants={mediaBlockVariants}
      whileHover={{scale: 0.8}}
      transition={{type: 'spring', bounce: 0.5, visualDuration: 0.35}}
      className="relative cursor-pointer bg-black w-full aspect-square flex items-center justify-center"
    >
      {count}
    </motion.div>
  )
}
