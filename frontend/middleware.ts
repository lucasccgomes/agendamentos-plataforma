import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('app_token')?.value;

  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('✅ Requisição autorizada, continuando...');
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/schedule/:path*', '/client-appointments/:path*'],
};
