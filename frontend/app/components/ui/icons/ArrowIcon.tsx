import {Locale} from '@/app/lib/i18n/config'

export default function ArrowIcon({lang}: {lang: Locale}) {
  return <span aria-hidden="true">{lang === 'ar' ? '←' : '→'}</span>
}
