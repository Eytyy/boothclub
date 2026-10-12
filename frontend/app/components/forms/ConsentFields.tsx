import type {FieldErrors, FieldValues, Path, UseFormRegister} from 'react-hook-form'

import type {Locale} from '@/app/lib/i18n/config'
import {formatPrivacyNote} from '@/app/lib/utils'
import {FieldError} from './Field'
import type {FormSettings} from './config'

const PRIVACY_PATH = '/privacy-policy'

/** Optional opt-in and consent checkboxes; each renders only when the CMS gives it a label. */
export function ConsentFields<T extends FieldValues>({
  settings,
  register,
  errors,
  lang,
  idPrefix,
}: {
  settings: FormSettings
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  lang: Locale
  idPrefix: string
}) {
  const {consentText, notificationsLabel, personalDataNote} = settings
  if (!consentText && !notificationsLabel) return null

  const consentError = (errors as Record<string, {message?: string} | undefined>).consent?.message
  const consentErrId = `${idPrefix}-consent-error`

  return (
    <div className="space-y-4">
      {notificationsLabel ? (
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1.5 h-4 w-4 shrink-0 accent-black dark:accent-white"
            {...register('notifications' as Path<T>)}
          />
          <span>{notificationsLabel}</span>
        </label>
      ) : null}
      {consentText ? (
        <div className="space-y-1">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              required
              aria-invalid={consentError ? true : undefined}
              aria-describedby={consentError ? consentErrId : undefined}
              className="mt-1.5 h-4 w-4 shrink-0 accent-black dark:accent-white"
              {...register('consent' as Path<T>)}
            />
            <span>
              {formatPrivacyNote({privacyNote: consentText, privacySlug: PRIVACY_PATH, lang}) ??
                consentText}
            </span>
          </label>
          <FieldError id={consentErrId} message={consentError} />
        </div>
      ) : null}
      {personalDataNote ? <p className="text-sm opacity-80">{personalDataNote}</p> : null}
    </div>
  )
}
