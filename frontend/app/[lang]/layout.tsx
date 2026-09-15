import '../globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {IBM_Plex_Mono, Poppins} from 'next/font/google'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'
import Script from 'next/script'
import {Suspense} from 'react'

import DraftModeToast from '@/app/components/DraftModeToast.client'
import Footer from '@/app/components/layout/Footer'
import Header from '@/app/components/layout/Header'
import Providers from '@/app/components/layout/Providers.client'
import CookieBanner from '@/app/components/CookieBanner.client'
import GAListener from '@/app/components/GaListener.client'
import {handleError} from '@/app/client-utils'
import {isLocale, locales} from '@/app/lib/i18n/config'
import {LocaleProvider} from '@/app/lib/i18n/LocaleProvider.client'
import * as demo from '@/sanity/lib/demo'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  children: React.ReactNode
  params: Promise<{lang: string}>
}

export function generateStaticParams() {
  return locales.map((lang) => ({lang}))
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {lang} = await params
  if (!isLocale(lang)) {
    return {}
  }

  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    params: {lang},
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description || undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export default async function RootLayout({children, params}: Props) {
  const {lang} = await params
  if (!isLocale(lang)) notFound()

  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html
      lang={lang}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`${poppins.variable} ${ibmPlexMono.variable} bg-white text-black dark:bg-black dark:text-white`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme');if(s==='brand'){s='light';localStorage.setItem('theme','light')}if(s==='dark'||(s!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))d.classList.add('dark')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>
        )}
        {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
            <VisualEditing />
          </>
        )}
        {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
        <SanityLive onError={handleError} />
        <LocaleProvider value={lang}>
          <Providers>
            <Header lang={lang} />
            <main className="min-h-svh relative z-20 bg-white dark:bg-black">{children}</main>
            <Footer lang={lang} />
          </Providers>
        </LocaleProvider>
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted'
            });
          `}
        </Script>
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
        <CookieBanner />
        <Suspense>
          <GAListener />
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  )
}
