import {stegaClean} from '@sanity/client/stega'
import type {PortableTextBlock} from 'next-sanity'

import PortableText from '@/app/components/ui/PortableText'
import JsonLd from '@/app/components/seo/JsonLd'
import FaqAccordion from './FaqAccordion.client'

type Faq = {_key: string; question: string | null; answer: unknown}

const plainText = (blocks: PortableTextBlock[]) =>
  blocks
    .map((block) =>
      Array.isArray(block.children)
        ? block.children.map((child) => (child as {text?: string}).text ?? '').join('')
        : '',
    )
    .filter(Boolean)
    .join('\n\n')

/** FAQ accordion plus FAQPage structured data for search results. */
export default function FaqSection({items}: {items: Faq[]}) {
  const faqs = items.flatMap((item) => {
    const blocks = Array.isArray(item.answer) ? (item.answer as PortableTextBlock[]) : []
    return item.question && blocks.length ? [{...item, question: item.question, blocks}] : []
  })
  if (!faqs.length) return null

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqs.map((f) => ({
            '@type': 'Question',
            'name': stegaClean(f.question),
            'acceptedAnswer': {'@type': 'Answer', 'text': stegaClean(plainText(f.blocks))},
          })),
        }}
      />
      <FaqAccordion
        items={faqs.map((f) => ({
          id: f._key,
          question: f.question,
          answer: (
            <PortableText
              value={f.blocks}
              invert={false}
              className="space-y-4 [&_a]:underline [&_a]:underline-offset-2"
            />
          ),
        }))}
      />
    </>
  )
}
