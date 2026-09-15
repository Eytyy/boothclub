import ResolvedLink from '@/app/components/ui/ResolvedLink'
import {localizedPath} from '@/app/lib/i18n/config'
import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'
import {cn} from '@/app/lib/utils'
import {linkResolver} from '@/sanity/lib/utils'
import type {DereferencedLink, SiteMenuGroupChild, SiteMenuLeaf} from '@/sanity/lib/types'

export type NavMenuItemData = SiteMenuLeaf | SiteMenuGroupChild

interface NavMenuItemProps {
  item: NavMenuItemData
  pathname: string
  onNavigate: () => void
  className?: string
}

export default function NavMenuItem({item, pathname, onNavigate, className}: NavMenuItemProps) {
  const lang = useLocale()
  const link = item?.link as DereferencedLink | undefined
  const href = link ? linkResolver(link, lang) : null

  if (!item?.title || !link || !href) return null

  const homeHref = localizedPath(lang, '/')
  const isActive = href === pathname || (href !== homeHref && pathname.startsWith(`${href}/`))

  return (
    <li>
      <ResolvedLink
        link={link}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'hover:underline text-2xl md:text-3xl lg:text-5xl font-semibold leading-[1.1]',
          isActive && 'underline underline-offset-4',
          className,
        )}
      >
        {item.title}
      </ResolvedLink>
    </li>
  )
}
