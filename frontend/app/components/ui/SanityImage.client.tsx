'use client'

import {SanityImage, type WrapperProps} from 'sanity-image'

import {dataset, projectId} from '@/sanity/lib/api'

type SanityHotspot = {x?: number; y?: number}
type SanityCrop = {top?: number; bottom?: number; left?: number; right?: number}

type Props<T extends React.ElementType = 'img'> = Omit<WrapperProps<T>, 'hotspot' | 'crop'> & {
  hotspot?: SanityHotspot | null
  crop?: SanityCrop | null
}

const Image = <T extends React.ElementType = 'img'>({hotspot, crop, ...props}: Props<T>) => (
  <SanityImage
    baseUrl={`https://cdn.sanity.io/images/${projectId}/${dataset}/`}
    hotspot={hotspot as WrapperProps<T>['hotspot']}
    crop={crop as WrapperProps<T>['crop']}
    {...(props as WrapperProps<T>)}
  />
)

export default Image
