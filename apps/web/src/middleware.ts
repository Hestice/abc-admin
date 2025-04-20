import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes } from './constants/routes';
import { getToken } from 'next-auth/jwt';
import { isProtectedRoute } from './utils/get-routes';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = isProtectedRoute(pathname);
  const isHomePage = pathname === AppRoutes.HOME;

  // Get session token from NextAuth
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login page if accessing protected route without session
  if (isAuthRoute && !session) {
    return NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
  }

  // Redirect to dashboard if already logged in and accessing home page
  if (isHomePage && session) {
    return NextResponse.redirect(new URL(AppRoutes.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Update the matcher to include specific paths we want to protect
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admins/:path*',
    '/patients/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
