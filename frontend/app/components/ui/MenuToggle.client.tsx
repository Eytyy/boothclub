'use client'

import {AnimatePresence} from 'framer-motion'

interface MenuToggleProps {
  isOpen: boolean
  onClick: () => void
}

export default function MenuToggle({isOpen, onClick}: MenuToggleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className="flex items-center justify-center lg:w-8 lg:h-8 w-6 h-6 border-2  rounded-full"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? <CloseIcon /> : <OpenIcon />}
      </AnimatePresence>
    </button>
  )
}

const CloseIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const OpenIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
