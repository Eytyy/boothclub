import {cn} from '@/app/lib/utils'

export const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'x',
  'linkedin',
  'youtube',
  'tiktok',
  'threads',
] as const

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]

type Props = {
  platform: SocialPlatform | string | null | undefined
  className?: string
  size?: number
}

export default function SocialIcon({platform, className, size = 20}: Props) {
  const key = typeof platform === 'string' ? platform.toLowerCase() : null
  const Icon = key && key in ICONS ? ICONS[key as SocialPlatform] : null
  if (!Icon) return null
  return (
    <span
      className={cn('inline-flex h-5 w-5 items-center justify-center', className)}
      style={{width: size, height: size}}
      aria-hidden="true"
    >
      <Icon />
    </span>
  )
}

/* Inline SVGs — keep viewBox=24 for consistent sizing. Paths use currentColor so
   the icon inherits the parent text colour. */

const Facebook = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.52 1.56-1.52H17V3.6A22.4 22.4 0 0 0 14.6 3.5c-2.4 0-4 1.46-4 4.15V9.9H8v3.1h2.6V21h2.9Z" />
  </svg>
)

const Instagram = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const X = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M17.53 3H20.5l-6.53 7.46L22 21h-6.1l-4.77-6.24L5.7 21H2.72l7-8L2 3h6.23l4.31 5.7L17.53 3Zm-1.07 16.2h1.66L7.64 4.7H5.86L16.46 19.2Z" />
  </svg>
)

const LinkedIn = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5a2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm7 0h3.85v1.53h.06c.53-.95 1.85-1.95 3.8-1.95C21.5 9.33 22 11.7 22 14.8V21h-4v-5.5c0-1.3-.03-3-1.85-3S14 13.9 14 15.4V21h-4V9.75Z" />
  </svg>
)

const YouTube = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M23 12s0-3.26-.42-4.82a2.5 2.5 0 0 0-1.76-1.77C19.27 5 12 5 12 5s-7.27 0-8.82.41A2.5 2.5 0 0 0 1.42 7.18C1 8.74 1 12 1 12s0 3.26.42 4.82a2.5 2.5 0 0 0 1.76 1.77C4.73 19 12 19 12 19s7.27 0 8.82-.41a2.5 2.5 0 0 0 1.76-1.77C23 15.26 23 12 23 12Zm-13.2 3V9l5.4 3-5.4 3Z" />
  </svg>
)

const TikTok = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M16 3c.33 1.72 1.25 3.17 2.74 4.03A6.4 6.4 0 0 0 22 8v3a9.3 9.3 0 0 1-5.3-1.66v6.3a6 6 0 1 1-6-6c.34 0 .67.03 1 .1v3.13a3 3 0 1 0 2 2.83V3h2.3Z" />
  </svg>
)

const Threads = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <path d="M12 21c5 0 8-3.2 8-9s-3-9-8-9-8 3.2-8 9 3 9 8 9Z" />
    <path d="M8.5 14.2c.8 1.3 2.2 2 3.9 2 2 0 3.3-1 3.3-2.5 0-1.7-1.7-2.3-3.9-2.7-2.3-.4-3.4-1-3.4-2.3 0-1.3 1.2-2.2 3-2.2 1.6 0 2.9.7 3.5 1.9" />
  </svg>
)

const ICONS: Record<SocialPlatform, () => React.ReactElement> = {
  facebook: Facebook,
  instagram: Instagram,
  x: X,
  linkedin: LinkedIn,
  youtube: YouTube,
  tiktok: TikTok,
  threads: Threads,
}
