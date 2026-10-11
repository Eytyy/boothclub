'use client'

import {cn} from '@/app/lib/utils'

interface MenuToggleProps {
  isOpen: boolean
  onClick: () => void
}

/** Circled plus that collapses to a minus while the menu is open. */
export default function MenuToggle({isOpen, onClick}: MenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className="flex items-center justify-center w-8 h-8 border-2 rounded-full cursor-pointer"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <line
          x1="12"
          y1="5"
          x2="12"
          y2="19"
          className={cn('origin-center transition-transform duration-300', isOpen && 'scale-y-0')}
        />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )
}
