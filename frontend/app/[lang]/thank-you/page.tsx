import type {Metadata} from 'next'

import Button from '@/app/components/ui/Button'
import PageTitle from '@/app/components/ui/PageTitle'
import type {Locale} from '@/app/lib/i18n/config'
import {getDictionary} from '@/app/lib/i18n/dictionary'
import {localeAlternates} from '@/app/lib/seo/alternates'

type Props = {
  params: Promise<{lang: Locale}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  const t = getDictionary(lang)
  return {
    title: t['thankYou.metaTitle'],
    description: t['thankYou.metaDescription'],
    robots: {
      index: false,
      follow: true,
    },
    alternates: localeAlternates(lang, '/thank-you'),
  }
}

export default async function ThankYouPage({params}: Props) {
  const {lang} = await params
  const t = getDictionary(lang)

  return (
    <div className="mt-10 lg:-mt-20 min-h-dvh flex flex-col items-center justify-center gap-10 lg:gap-16 py-20">
      <header className="space-y-6 lg:space-y-10 text-center">
        <PageTitle as="h1">{t['thankYou.title']}</PageTitle>
        <p className="container max-w-4xl  text-lg lg:text-2xl leading-tight">
          {t['thankYou.body']}
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/projects">{t['actions.viewOurWork']}</Button>
        <Button href="/">{t['actions.backToHome']}</Button>
      </div>
    </div>
  )
}
