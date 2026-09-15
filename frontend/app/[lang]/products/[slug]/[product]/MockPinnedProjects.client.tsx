'use client'
import {ProjectCardData} from '@/app/components/project/types'
import Image from '@/app/components/ui/SanityImage.client'
import {useEffect, useState} from 'react'

export function HeroShuffle({items}: {items: ProjectCardData[]}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
    }, 500)
    return () => clearInterval(interval)
  }, [items.length])
  const item = items[currentIndex]
  const imageRef = item?.mainImage?.asset?._ref

  return (
    <div className="grid grid-cols-4  gap-10 aspect-square">
      <div className="col-span-2 col-start-2 bg-black aspect-square self-center">
        {items[currentIndex] && (
          <div className="overflow-hidden rounded-sm">
            {imageRef ? (
              <Image
                id={imageRef}
                alt={item.mainImage?.alt || item.title || ''}
                className="aspect-square w-full object-cover"
                width={600}
                height={600}
                mode="cover"
                hotspot={item.mainImage?.hotspot ?? undefined}
                crop={item.mainImage?.crop ?? undefined}
                preview={item.mainImage?.lqip ?? undefined}
              />
            ) : (
              <div className="aspect-square w-full bg-black/5 dark:bg-white/5" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
