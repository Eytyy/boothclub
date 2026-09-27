import {GridBlock} from '@/app/components/ui/GridSystem'
import {cn} from '@/app/lib/utils'
import SectionTitleMarquee from '../ui/SectionTitleMarquee'

type SpecItem = {
  _key: string
  text: string
}

type SpecsBlockProps = {
  items?: SpecItem[]
  className?: string
}

export default function SpecsBlock({items, className}: SpecsBlockProps) {
  if (!items?.length) return null

  return (
    <div className={cn(className)}>
      <SectionTitleMarquee>Specs</SectionTitleMarquee>
      {items.map((item) => (
        <GridBlock as="div" borders="bottom" key={item._key} className="text-2xl font-bold">
          <span>{item.text}</span>
        </GridBlock>
      ))}
    </div>
  )
}
