import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {Marquee} from '@/app/components/ui/Marquee.client'
import {cn} from '@/app/lib/utils'

export default function PostMarqueeRow({
  href,
  label,
  title,
  index = 0,
  sanity,
}: {
  href: string
  label: string
  title: string
  index?: number
  sanity?: string
}) {
  return (
    <article
      data-sanity={sanity}
      className="relative border-b-site border-black last:border-b-0 dark:border-white"
    >
      <LocalizedLink href={href}>
        <span className="absolute inset-0 z-10" />
        <span className="sr-only">{`${label}: ${title}`}</span>
      </LocalizedLink>
      <Marquee speed={100 + index * 2} runClassName="mx-0" className="h-auto">
        <span
          className={cn(
            'page-title inline-flex items-baseline gap-[0.35em] tracking-normal uppercase',
            'whitespace-nowrap px-10 py-5',
          )}
        >
          <span className="font-normal">{label}</span>
          <span>{title}</span>
        </span>
      </Marquee>
    </article>
  )
}
