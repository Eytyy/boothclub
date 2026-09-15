import type {PortableTextBlock} from 'next-sanity'

import PageTitle from '@/app/components/ui/PageTitle'
import PortableText from '@/app/components/ui/PortableText'
import LocalizedLink from '@/app/components/ui/LocalizedLink'

type ProductHeroTextProps = {
  title: string
  titleVariant?: 'default' | 'large'
  eyebrow?: string | null
  eyebrowHref?: string | null
  tagline?: string | null
  description?: PortableTextBlock[] | null
}

export default function ProductHeroText({
  title,
  titleVariant = 'default',
  eyebrow,
  eyebrowHref,
  tagline,
  description,
}: ProductHeroTextProps) {
  const eyebrowTitle = eyebrow ? <PageTitle as="p">{eyebrow}</PageTitle> : null

  return (
    <div className="space-y-5 flex flex-col items-center">
      {eyebrowTitle ? (
        eyebrowHref ? (
          <LocalizedLink href={eyebrowHref}>{eyebrowTitle}</LocalizedLink>
        ) : (
          eyebrowTitle
        )
      ) : null}
      <header>
        <PageTitle variant={titleVariant}>{title}</PageTitle>
      </header>
      {tagline ? (
        <p className="text-6xl font-bold text-center 2xl:max-w-[36ch]">{tagline}</p>
      ) : null}
      <div className="text-center px-5 lg:px-10">
        {description && description.length > 0 ? (
          <PortableText
            className="mx-auto 2xl:max-w-[75ch] text-center text-base md:text-lg leading-relaxed"
            value={description}
          />
        ) : null}
      </div>
    </div>
  )
}
