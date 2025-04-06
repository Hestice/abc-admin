import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes, isProtectedRoute } from './enums';
import { AuthApi, Configuration } from '@abc-admin/api-lib';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = isProtectedRoute(pathname);
  const isHomePage = pathname === AppRoutes.HOME || pathname === AppRoutes.LOGIN;
  const authToken = request.cookies.get('auth_token')?.value;
  
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
          headers: {
            Cookie: `auth_token=${authToken}`
          }
        }
      });
      
      const authApi = new AuthApi(configuration);
      
      await authApi.authControllerVerifyToken();
    } catch (error) {
      const response = NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
      response.cookies.delete('auth_token');
      response.cookies.delete('user_role');
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
    `${AppRoutes.DASHBOARD}/:path*`,
    AppRoutes.HOME,
    AppRoutes.LOGIN
  ],
}; 