import { NextResponse, type NextRequest } from 'next/server'
import { locales, matchLocale } from '@/lib/locales'

/**
 * Locale routing. (In Next 16 this file is `proxy.ts`, not `middleware.ts`.)
 *
 * Sends `/` to the visitor's preferred language and leaves every already
 * prefixed path alone.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return NextResponse.next()

  const locale = matchLocale(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.[\\w]+$).*)'],
}
