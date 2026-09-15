'use client'

import Button, {type ButtonProps} from './Button'
import ArrowIcon from './icons/ArrowIcon'

export default function ArrowButton({children, ...rest}: ButtonProps) {
  return (
    <Button {...rest}>
      {children}
      {/* <ArrowIcon /> */}
    </Button>
  )
}
