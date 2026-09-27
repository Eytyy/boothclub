'use client'

import {cn} from '@/app/lib/utils'

type OverlayArrowButtonProps = {
  direction: 'prev' | 'next'
  label: string
  onClick: () => void
  className?: string
}

const positionStyles = {
  prev: 'top-5 left-5',
  next: 'bottom-5 right-5',
} as const

export default function OverlayArrowButton({
  direction,
  label,
  onClick,
  className,
}: OverlayArrowButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'pointer-events-auto absolute uppercase text-lg p-5 bg-black text-white hover:bg-white hover:text-black font-bold w-10 h-10 flex items-center justify-center rounded-full',
        positionStyles[direction],
        className,
      )}
      aria-label={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{direction === 'next' ? '→' : '←'}</span>
    </button>
  )
}
