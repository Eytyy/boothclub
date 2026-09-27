import {cn} from '@/app/lib/utils'
import type {FieldErrors, FieldValues, Path, UseFormRegister} from 'react-hook-form'

interface InputProps<T extends FieldValues = FieldValues> {
  f: {name: string; type: string; required?: boolean; autoComplete?: string}
  id: string
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  helpId?: string
  errId?: string
  className?: string
  placeholder?: string
}

const Input = <T extends FieldValues = FieldValues>({
  f,
  id,
  register,
  errors,
  helpId,
  errId,
  className,
  placeholder,
}: InputProps<T>) => {
  const hasError = Boolean(errors[f.name as Path<T>])
  const describedby = [helpId, hasError ? errId : undefined].filter(Boolean).join(' ') || undefined
  const textFieldClassName = cn(
    'block w-full border-0 border-b border-gray-300 bg-transparent shadow-none rounded-none',
    'placeholder-gray-400 sm:text-sm',
  )
  const checkboxClassName = cn('block rounded-md border border-gray-300 shadow-xs sm:text-sm')

  const inputClassName = cn(
    'py-2 w-full',
    'focus:border-primary-foreground focus:outline-none focus:ring-0',
    'dark:focus:border-primary-foreground',
    'disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500',
    'dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20',
    'user-invalid:border-red-600 user-invalid:text-red-700 focus:user-invalid:border-red-600',
    'dark:user-invalid:border-red-500 dark:user-invalid:text-red-400 dark:focus:user-invalid:border-red-500',
  )
  const commonProps = {
    id,
    'aria-invalid': hasError || undefined,
    'aria-describedby': describedby,
    'required': f.required || undefined,
    'autoComplete': f.autoComplete,
    'placeholder': placeholder || undefined,
    ...register(f.name as Path<T>),
  }
  switch (f.type) {
    case 'checkbox':
      return <input type="checkbox" className={cn(checkboxClassName, className)} {...commonProps} />
    case 'textarea':
      return (
        <textarea
          rows={8}
          className={cn(textFieldClassName, inputClassName, className)}
          {...commonProps}
        />
      )
    default:
      return (
        <input
          type={f.type}
          className={cn(textFieldClassName, inputClassName, className)}
          {...commonProps}
        />
      )
  }
}

export default Input
