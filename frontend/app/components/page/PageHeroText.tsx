import PortableText from '@/app/components/ui/PortableText'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {PortableTextBlock} from 'next-sanity'
import PageTitle from '../ui/PageTitle'

type PageHeroTextProps = {
  title: string
  eyebrow?: string | null
  eyebrowHref?: string | null
  tagline?: string | null
  description?: PortableTextBlock[] | null
}

export default function PageHeroText({
  title,
  eyebrow,
  eyebrowHref,
  tagline,
  description,
}: PageHeroTextProps) {
  const eyebrowTitle = eyebrow ? <PageTitle as="p">{eyebrow}</PageTitle> : null

  return (
    <div className="space-y-5 flex flex-col">
      {eyebrowTitle ? (
        eyebrowHref ? (
          <LocalizedLink href={eyebrowHref}>{eyebrowTitle}</LocalizedLink>
        ) : (
          eyebrowTitle
        )
      ) : null}
      <header>
        <PageTitle as="h1">{title}</PageTitle>
      </header>
      {tagline ? <p className="text-6xl font-bold  2xl:max-w-[36ch]">{tagline}</p> : null}
      {description && description.length > 0 ? (
        <PortableText className="text-base md:text-lg leading-relaxed" value={description} />
      ) : null}
    </div>
  )
}
