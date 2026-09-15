import {NextRequest, NextResponse} from 'next/server'

import {defaultLocale, locales} from '@/app/lib/i18n/config'

function pathnameHasLocale(pathname: string) {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathnameHasLocale(pathname)) {
    return
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // `next` = draft preview routes (/next/preview, /next/exit-preview) — not locale pages
  matcher: ['/((?!_next|admin|api|next|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\..*).*)'],
}
