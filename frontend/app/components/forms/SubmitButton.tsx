import Button, {type ButtonVariant} from '@/app/components/ui/Button'
import {Locale} from '@/app/lib/i18n/config'
import ArrowIcon from '../ui/icons/ArrowIcon'

type Props = {
  isSubmitting: boolean
  disabled?: boolean
  label: string
  submittingLabel: string
  variant?: ButtonVariant
  className?: string
  lang: Locale
}

export default function SubmitButton({
  isSubmitting,
  disabled,
  label,
  submittingLabel,
  variant = 'primary',
  className,
  lang,
}: Props) {
  return (
    <Button
      type="submit"
      disabled={disabled ?? isSubmitting}
      variant={variant}
      className={className}
    >
      {isSubmitting ? (
        submittingLabel
      ) : (
        <span className="">
          {label} <ArrowIcon lang={lang} />
        </span>
      )}
    </Button>
  )
}
