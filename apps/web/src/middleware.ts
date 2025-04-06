import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes } from './constants/routes';
import { AuthApi, Configuration } from '@abc-admin/api-lib';
import { isProtectedRoute } from './utils/get-routes';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = isProtectedRoute(pathname);
  const isHomePage = pathname === AppRoutes.HOME;
  
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'auth_token';
  const authToken = request.cookies.get(cookieName)?.value;
  
  if (isAuthRoute && !authToken) {
    return NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
  }

  if (isAuthRoute && authToken) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      
      const configuration = new Configuration({
        basePath: backendUrl,
        baseOptions: {
          withCredentials: true,
          credentials: 'include',
          headers: {
            Cookie: `${cookieName}=${authToken}`,
            Authorization: `Bearer ${authToken}`
          }
        }
      });
      
      const authApi = new AuthApi(configuration);
      
      await authApi.authControllerVerifyToken();
    } catch (error) {
      console.error('Token verification failed:', error);
      const response = NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
      response.cookies.delete(cookieName);
      return response;
    }
  }

  if (isHomePage && authToken) {
    return NextResponse.redirect(new URL(AppRoutes.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path*',
  ]
}