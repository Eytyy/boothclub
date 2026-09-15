import type {PortableTextBlock} from 'next-sanity'

import type {ProductCardImage} from '@/app/components/product/types'
import ProductHeroMedia from './ProductHeroMedia'
import ProductHeroText from './ProductHeroText'

type ProductHeroProps = {
  title: string
  titleVariant?: 'default' | 'large'
  eyebrow?: string | null
  eyebrowHref?: string | null
  tagline?: string | null
  description?: PortableTextBlock[] | null
  mainImage?: ProductCardImage
  heroPlaybackId?: string | null
}

export default function ProductHero({
  title,
  titleVariant = 'default',
  eyebrow,
  eyebrowHref,
  tagline,
  description,
  mainImage,
  heroPlaybackId,
}: ProductHeroProps) {
  return (
    <div className="space-y-10 ">
      <ProductHeroMedia title={title} mainImage={mainImage} heroPlaybackId={heroPlaybackId} />
      <ProductHeroText
        title={title}
        titleVariant={titleVariant}
        eyebrow={eyebrow}
        eyebrowHref={eyebrowHref}
        tagline={tagline}
        description={description}
      />
    </div>
  )
}
