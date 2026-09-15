/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import type {ReactNode} from 'react'
import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import ResolvedLink from './ResolvedLink'
import Image from './SanityImage.client'

export default function CustomPortableText({
  className,
  value,
  invert = true,
}: {
  className?: string
  value: PortableTextBlock[]
  /** When false, skip prose chrome so parent text color/size inherit (e.g. footer). */
  invert?: boolean
}) {
  const components: PortableTextComponents = {
    types: {
      image: ({value}) => {
        if (!value?.asset?._ref) {
          return null
        }

        return (
          <figure className="my-8">
            <Image
              id={value.asset._ref}
              alt={value.alt || ''}
              width={672}
              hotspot={value.hotspot}
              crop={value.crop}
              preview={value.lqip ?? undefined}
              className="rounded-sm"
            />
          </figure>
        )
      },
    },
    block: {
      h1: ({children, value}) => (
        <h1 className="group relative">
          {children}
          <a
            href={`#${value?._key}`}
            className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </a>
        </h1>
      ),
      h2: ({children, value}) => {
        return (
          <h2 className="group relative">
            {children}
            <a
              href={`#${value?._key}`}
              className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </a>
          </h2>
        )
      },
      ...(invert
        ? {}
        : {
            normal: ({children}: {children?: ReactNode}) => <p className="my-0">{children}</p>,
          }),
    },
    marks: {
      link: ({children, value: link}) => {
        return (
          <ResolvedLink link={link} className={invert ? undefined : 'underline underline-offset-2'}>
            {children}
          </ResolvedLink>
        )
      },
    },
  }

  return (
    <div
      className={invert ? `prose dark:prose-invert ${className ?? ''}` : (className ?? undefined)}
    >
      <PortableText components={components} value={value} />
    </div>
  )
}
