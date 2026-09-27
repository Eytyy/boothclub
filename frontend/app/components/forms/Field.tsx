import {cn} from '@/app/lib/utils'

interface FieldProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export const FieldGroup = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

const Field = ({children, orientation = 'vertical'}: FieldProps) => {
  return (
    <div
      className={cn(
        'flex flex-wrap',
        orientation === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-1',
      )}
    >
      {children}
    </div>
  )
}

export default Field

export const FieldLabel = ({
  children,
  htmlFor,
  className,
}: {
  children: React.ReactNode
  htmlFor: string
  className?: string
}) => {
  return (
    <label htmlFor={htmlFor} className={cn('font-medium text-lg', className)}>
      {children}
    </label>
  )
}

export const FieldError = ({id, message}: {message?: string; id: string}) => {
  if (!message) return null
  return (
    <div
      id={id}
      aria-live="polite"
      className="w-full shrink-0 text-sm text-red-600 dark:text-red-400"
    >
      {message}
    </div>
  )
}

export const FieldHelp = ({id, children}: {id: string; children: React.ReactNode}) => {
  if (!children) return null
  return (
    <div id={id} className="w-full shrink-0 self-start justify-self-start text-sm">
      {children}
    </div>
  )
}
