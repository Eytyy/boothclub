import LocalizedLink from '@/app/components/ui/LocalizedLink'

import type {ProjectCardData} from './types'

type ProjectTextRowProps = {
  item: ProjectCardData
}

export default function ProjectTextRow({item}: ProjectTextRowProps) {
  const product = item.products?.[0]?.title

  return (
    <LocalizedLink
      href={`/projects/${item.slug}`}
      className="flex items-baseline justify-between gap-4 border-b border-black/10 dark:border-white/10 py-4 transition-colors hover:text-black/60 dark:hover:text-white/60"
    >
      <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
      {product ? (
        <span className="shrink-0 text-sm text-black/60 dark:text-white/60">{product}</span>
      ) : null}
    </LocalizedLink>
  )
}
