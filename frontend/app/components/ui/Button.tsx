'use client'

import LocalizedLink from './LocalizedLink'
import ResolvedLink from './ResolvedLink'
import {DereferencedLink} from '@/sanity/lib/types'

export type ButtonVariant = 'footer' | 'primary'

const baseStyles =
  'tracking-normal inline-flex items-center gap-2  text-sm font-medium  sm:text-base md:text-lg lg:text-xl xl:text-2xl lowercase transition-colors disabled:cursor-not-allowed disabled:bg-[#ddd] disabled:text-[#aaa] disabled:border-[#ddd] disabled:hover:bg-[#ddd] disabled:hover:border-[#ddd] disabled:hover:text-[#aaa]'

export const variantStyles: Record<ButtonVariant, string> = {
  footer: `${baseStyles}  text-white dark:text-black`,
  primary: `${baseStyles} text-black `,
}

type CommonProps = {
  variant?: ButtonVariant
  className?: string
  children: React.ReactNode
}

type LinkButtonProps = CommonProps & {
  link: DereferencedLink
  href?: never
}

type HrefButtonProps = CommonProps & {
  href: string
  link?: never
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

type NativeButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: never
    link?: never
  }

export type ButtonProps = LinkButtonProps | HrefButtonProps | NativeButtonProps

export default function Button({variant = 'primary', className, children, ...rest}: ButtonProps) {
  const classes = `${variantStyles[variant]}${className ? ` ${className}` : ''}`

  if ('link' in rest && rest.link) {
    return (
      <ResolvedLink link={rest.link} className={classes}>
        {children}
      </ResolvedLink>
    )
  }

  if ('href' in rest && rest.href) {
    const {href, onClick} = rest as HrefButtonProps
    return (
      <LocalizedLink href={href} onClick={onClick} className={classes}>
        {children}
      </LocalizedLink>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {link, href, ...buttonProps} = rest as NativeButtonProps
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
