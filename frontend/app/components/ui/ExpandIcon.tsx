import {cn} from '@/app/lib/utils'

/** Circled plus that turns into a minus when open. */
export default function ExpandIcon({isOpen}: {isOpen: boolean}) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-full border-2 lg:border-[3px]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="w-4 h-4 lg:w-5 lg:h-5"
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
    </span>
  )
}
