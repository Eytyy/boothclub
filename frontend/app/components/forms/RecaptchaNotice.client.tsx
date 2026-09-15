'use client'

import {useDictionary} from '@/app/lib/i18n/LocaleProvider.client'

export default function RecaptchaNotice() {
  const t = useDictionary()

  return (
    <p className="text-xs opacity-70">
      {t['form.recaptcha.before']}
      <a
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {t['form.recaptcha.privacyPolicy']}
      </a>
      {t['form.recaptcha.middle']}
      <a
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        {t['form.recaptcha.terms']}
      </a>
      {t['form.recaptcha.after']}
    </p>
  )
}
