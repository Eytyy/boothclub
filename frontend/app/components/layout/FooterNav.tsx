import ResolvedLink from '@/app/components/ui/ResolvedLink'
import type {Locale} from '@/app/lib/i18n/config'
import {cn} from '@/app/lib/utils'
import {linkResolver} from '@/sanity/lib/utils'
import type {DereferencedLink} from '@/sanity/lib/types'

type FooterMenuItem = {
  _key: string
  title?: string | null
  link?: DereferencedLink
}

export default function FooterNav({
  items,
  lang,
  className,
}: {
  items: FooterMenuItem[] | undefined
  lang: Locale
  className?: string
}) {
  return (
    <nav
      className={cn(
        'flex flex-row flex-wrap items-center md:justify-center gap-x-8 gap-y-2 text-sm md:justify-self-center',
        className,
      )}
      aria-label="Footer navigation"
    >
      {items?.map((item) => {
        const link = item?.link as DereferencedLink | undefined
        if (!item?.title || !link || !linkResolver(link, lang)) return null
        return (
          <ResolvedLink key={item._key} link={link} className="hover:underline">
            {item.title}
          </ResolvedLink>
        )
      })}
    </nav>
  )
}
