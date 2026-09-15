'use client'

import {useSyncExternalStore} from 'react'

type Theme = 'light' | 'dark'

function getTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

const subscribe = (cb: () => void) => {
  const observer = new MutationObserver(cb)
  if (typeof document !== 'undefined') {
    observer.observe(document.documentElement, {attributes: true, attributeFilter: ['class']})
  }
  return () => observer.disconnect()
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}

const ARIA_LABELS: Record<Theme, string> = {
  light: 'Switch to dark mode',
  dark: 'Switch to light mode',
}

export default function DarkModeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as Theme)

  function toggle() {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggle}
      aria-label={ARIA_LABELS[theme]}
      className="flex items-center justify-center lg:w-10 lg:h-10 w-8 h-8 p-1 rounded-full"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg
      className="w-full h-full fill-current"
      viewBox="0 0 123 123"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M122.276 69.7522C122.116 66.7822 118.946 65.1022 116.636 65.7822C81.7962 70.1922 51.7762 40.0222 56.5562 5.12219C56.9962 1.89219 54.8362 -0.477822 51.5162 0.0821775C14.9862 6.29218 -8.75383 44.5622 3.05617 80.0222C14.6062 114.732 54.7062 131.842 87.8162 116.412C105.686 108.082 118.386 91.0722 122.006 71.8222C122.286 71.2022 122.376 70.4822 122.276 69.7622V69.7522ZM45.1662 111.572C14.7262 101.902 -0.62382 65.8822 13.6262 37.2422C20.6262 23.1722 33.2262 13.3122 48.0962 9.24218C47.2962 26.7322 53.2062 43.7822 65.8562 56.4322C78.5162 69.0822 95.5662 74.9822 113.046 74.1922C105.016 103.002 74.7062 120.972 45.1462 111.582L45.1662 111.572Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" fill="none" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}