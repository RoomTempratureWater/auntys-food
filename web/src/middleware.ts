import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/session';

export async function middleware(request: NextRequest) {
  // Try to update session if exists
  await updateSession(request);

  const session = request.cookies.get('session')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};
