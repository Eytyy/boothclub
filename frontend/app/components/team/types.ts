export type TeamMemberPicture = {
  asset?: {_ref?: string | null} | null
  alt?: string | null
  hotspot?: {x: number; y: number} | null
  crop?: {top: number; bottom: number; left: number; right: number} | null
  lqip?: string | null
} | null

export type TeamMemberCardData = {
  _id: string
  firstName?: string | null
  lastName?: string | null
  picture?: TeamMemberPicture
  bio?: string | null
}

export function teamMemberDisplayName(m: Pick<TeamMemberCardData, 'firstName' | 'lastName'>) {
  return [m.firstName, m.lastName].filter(Boolean).join(' ').trim()
}
