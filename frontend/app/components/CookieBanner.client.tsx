'use client'

import {useEffect, useRef} from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

function updateGoogleConsent(allowAnalytics: boolean, allowAds: boolean) {
  // @ts-expect-error gtag is injected by the GA script tag in the root layout
  window.gtag?.('consent', 'update', {
    analytics_storage: allowAnalytics ? 'granted' : 'denied',
    ad_storage: allowAds ? 'granted' : 'denied',
    ad_user_data: allowAds ? 'granted' : 'denied',
    ad_personalization: allowAds ? 'granted' : 'denied',
  })

  if (!allowAnalytics) {
    document.cookie = '_ga=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = '_gid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
  if (!allowAds) {
    document.cookie = '_gcl_au=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}

function applyConsentFromCategories(categories: string[]) {
  updateGoogleConsent(categories.includes('analytics'), categories.includes('marketing'))
}

export default function CookieBanner() {
  const inited = useRef(false)

  useEffect(() => {
    if (inited.current) return
    inited.current = true

    CookieConsent.run({
      // Bumped when consent categories change so returning visitors are re-prompted
      revision: 1,
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
        },
      },
      categories: {
        necessary: {enabled: true, readOnly: true},
        analytics: {enabled: false, readOnly: false},
        marketing: {enabled: false, readOnly: false},
      },
      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Cookies on this site',
              description:
                'We use essential cookies, plus analytics and advertising cookies (with your consent) to improve our website and measure our campaigns.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Only necessary',
              showPreferencesBtn: 'Manage preferences',
            },
            preferencesModal: {
              title: 'Your cookie preferences',
              acceptAllBtn: 'Accept all',
              savePreferencesBtn: 'Save choices',
              closeIconLabel: 'Close',
              sections: [
                {
                  title: 'Strictly necessary',
                  description: 'These cookies are essential for site operation.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Analytics',
                  description:
                    'These cookies help us understand how visitors interact with the site.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'Advertising',
                  description:
                    'These cookies are used to measure the effectiveness of our advertising campaigns and to show relevant ads.',
                  linkedCategory: 'marketing',
                },
              ],
            },
          },
        },
      },
      onFirstConsent: ({cookie}) => {
        applyConsentFromCategories(cookie.categories)
      },
      onChange: ({cookie}) => {
        applyConsentFromCategories(cookie.categories)
      },
    })

    const prefs = CookieConsent.getUserPreferences()
    applyConsentFromCategories(prefs.acceptedCategories)
  }, [])

  return null
}
