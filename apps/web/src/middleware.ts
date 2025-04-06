import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes, isProtectedRoute } from './enums';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = isProtectedRoute(pathname);
  const isHomePage = pathname === AppRoutes.HOME || pathname === AppRoutes.LOGIN;
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;

  if (isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
  }

  if (isHomePage && isAuthenticated) {
    return NextResponse.redirect(new URL(AppRoutes.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    `${AppRoutes.DASHBOARD}/:path*`,
    AppRoutes.HOME,
    AppRoutes.LOGIN
  ],
}; 