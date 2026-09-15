import type {Metadata} from 'next'

import Button from '@/app/components/ui/Button'
import PageTitle from '@/app/components/ui/PageTitle'
import LocalizedText from '@/app/lib/i18n/LocalizedText.client'

export const metadata: Metadata = {
  title: 'Page not found',
  description: "The page you're looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="mt-10 lg:-mt-20 min-h-dvh flex flex-col items-center justify-center gap-10 lg:gap-16 py-20">
      <header className="space-y-6 lg:space-y-10 text-center">
        <PageTitle as="h1">404</PageTitle>
        <p className="container max-w-[40ch] text-lg lg:text-2xl leading-tight">
          <LocalizedText k="notFound.body" />
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/projects">
          <LocalizedText k="actions.viewOurWork" />
        </Button>
        <Button href="/">
          <LocalizedText k="actions.backToHome" />
        </Button>
      </div>
    </div>
  )
}
