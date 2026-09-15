'use client'

import {format} from 'date-fns'
import {ar} from 'date-fns/locale'

import {useLocale} from '@/app/lib/i18n/LocaleProvider.client'

const FORMATS = {
  en: 'LLLL d, yyyy',
  ar: 'd LLLL yyyy',
} as const

export default function DateComponent({dateString}: {dateString: string | undefined}) {
  const lang = useLocale()

  if (!dateString) {
    return null
  }

  return (
    <time dateTime={dateString} className="">
      {format(new Date(dateString), FORMATS[lang], lang === 'ar' ? {locale: ar} : undefined)}
    </time>
  )
}
