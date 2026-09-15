import {ExtractPageBuilderType} from '@/sanity/lib/types'
import SectionHeader from '../SectionHeader.client'
import ParallaxGrid from '@/app/components/ui/ParallaxGrid.client'
import {Post} from '@/app/[lang]/blog/Post'
import SanityCtaButton from '../../ui/SanityCtaButton'
import FeaturedBlogPostsCarousel from '@/app/components/blog/FeaturedBlogPostsCarousel.client'
type FeaturedBlogPostsProps = {
  block: ExtractPageBuilderType<'featuredBlog'>
  index: number
  pageType: string
  pageId: string
}

export default function FeaturedBlogPosts({block}: FeaturedBlogPostsProps) {
  const {heading, posts} = block

  if (!posts?.length) return null

  return (
    <div className="lg:pt-20 lg:min-h-svh">
      <SectionHeader className="px-5 lg:px-10" heading={heading} />
      <FeaturedBlogPostsCarousel posts={posts} cta={<SanityCtaButton cta={block.cta} />} />
      <ParallaxGrid
        className="hidden lg:block"
        items={posts}
        renderItem={(post) => <Post post={post} />}
        variant="flowing"
        gridClassName="px-10 lg:px-20 grid grid-cols-2 2xl:grid-cols-4 gap-10 md:gap-10 2xl:gap-20 overflow-x-clip"
        footer={<SanityCtaButton cta={block.cta} />}
      />
    </div>
  )
}
