import Button, {type ButtonVariant} from '@/app/components/ui/Button'

type Props = {
  isSubmitting: boolean
  disabled?: boolean
  label: string
  submittingLabel: string
  variant?: ButtonVariant
  className?: string
}

export default function SubmitButton({
  isSubmitting,
  disabled,
  label,
  submittingLabel,
  variant = 'primary',
  className,
}: Props) {
  return (
    <Button
      type="submit"
      disabled={disabled ?? isSubmitting}
      variant={variant}
      className={className}
    >
      {isSubmitting ? submittingLabel : label}
    </Button>
  )
}
