import PortableText from '@/app/components/ui/PortableText'
import {PortableTextBlock} from 'next-sanity'
import PageTitle from '../ui/PageTitle'

type PageHeroTextProps = {
  title: string
  eyebrow?: string | null
  eyebrowHref?: string | null
  tagline?: string | null
  description?: PortableTextBlock[] | null
}

export default function PageHeroText({title, tagline, description}: PageHeroTextProps) {
  return (
    <div className="space-y-5 flex flex-col">
      <header>
        <PageTitle as="h1">{title}</PageTitle>
      </header>
      {tagline ? <p className="text-6xl font-bold  2xl:max-w-[36ch]">{tagline}</p> : null}
      {description && description.length > 0 ? (
        <PortableText className="body-text" value={description} />
      ) : null}
    </div>
  )
}
