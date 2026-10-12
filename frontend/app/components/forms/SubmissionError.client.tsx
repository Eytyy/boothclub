'use client'

import {useEffect, useRef} from 'react'

/** Server-side failure message. Takes focus when it appears so keyboard and screen reader users land on it. */
export default function SubmissionError({message}: {message: string}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [message])

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
    >
      {message}
    </div>
  )
}
