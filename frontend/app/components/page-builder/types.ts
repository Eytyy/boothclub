import type {MediaBlockData} from './blocks/MediaItem.client'

/** Discriminated union for shared content `pageBuilder` blocks. */
export type ContentBlock =
  | {_key: string; _type: 'block.contentSection'; headline?: string | null; text?: string | null}
  | ({_key: string; _type: 'block.media'} & MediaBlockData)
  | {
      _key: string
      _type: 'block.splitMedia'
      left?: MediaBlockData | null
      right?: MediaBlockData | null
    }

export type ContentBlocksProp = ContentBlock[] | null | undefined
