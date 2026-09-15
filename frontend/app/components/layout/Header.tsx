import type {Locale} from '@/app/lib/i18n/config'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import type {SiteMenuItem} from '@/sanity/lib/types'
import HeaderClient from './Header.client'

export default async function Header({lang}: {lang: Locale}) {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    params: {lang},
  })

  return (
    <HeaderClient
      items={settings?.siteMenu?.items as SiteMenuItem[] | undefined}
      ctaLabel={settings?.siteMenu?.ctaLabel}
    />
  )
}
