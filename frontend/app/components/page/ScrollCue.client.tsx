'use client'

export default function ScrollCue() {
  return (
    <div className="h-[14svh]  flex items-center justify-center bg-white dark:bg-black border-t-site">
      <div className="flex flex-col transition-transform duration-300">
        <div className="h-6 w-6 -rotate-45 border-site border-t-0 border-r-0 border-black dark:border-white" />
        <div className="h-6 w-6 -rotate-45 border-site border-t-0 border-r-0 border-black dark:border-white" />
      </div>
    </div>
  )
}
