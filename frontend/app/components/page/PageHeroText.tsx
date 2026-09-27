import PortableText from '@/app/components/ui/PortableText'
import LocalizedLink from '@/app/components/ui/LocalizedLink'
import {PortableTextBlock} from 'next-sanity'

type PageHeroTextProps = {
  title: string
  titleVariant?: 'default' | 'large'
  eyebrow?: string | null
  eyebrowHref?: string | null
  tagline?: string | null
  description?: PortableTextBlock[] | null
}

export default function PageHeroText({
  title,
  titleVariant = 'default',
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
        <PageTitle variant={titleVariant}>{title}</PageTitle>
      </header>
      {tagline ? <p className="text-6xl font-bold  2xl:max-w-[36ch]">{tagline}</p> : null}
      {description && description.length > 0 ? (
        <PortableText className="text-base md:text-lg leading-relaxed" value={description} />
      ) : null}
    </div>
  )
}

type PageTitleProps = {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'p'
  className?: string
  variant?: 'default' | 'large'
}

function PageTitle({children, as = 'h1'}: PageTitleProps) {
  const Tag = as || 'h1'
  return <Tag className={'text-6xl font-bold 2xl:max-w-[36ch]'}>{children}</Tag>
}
