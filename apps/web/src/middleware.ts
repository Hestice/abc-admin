import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppRoutes } from './constants/routes';
import { getToken } from 'next-auth/jwt';
import { isProtectedRoute } from './utils/get-routes';

export async function middleware(request: NextRequest) {
  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  const headers = response.headers;
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Rate limiting - check if IP has made too many requests
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';
  const rateLimit = await checkRateLimit(clientIp);
  if (rateLimit.limited) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Too many requests',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': rateLimit.retryAfter.toString(),
        },
      }
    );
  }

  // Expanded bot detection - reject requests from suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  if (isSuspiciousUserAgent(userAgent)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Access denied',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // CSRF protection check
  if (isPostRequest(request) && !hasValidCSRFToken(request)) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Invalid CSRF token',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

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

  // Add session metadata for client-side access
  if (session) {
    headers.set('x-user-authenticated', 'true');
    // Only expose minimal role information
    const userRole = (session as any).role;
    if (userRole) {
      headers.set('x-user-role', userRole);
    }
  }

  return response;
}

// Helper functions for security checks
const rateLimit = new Map<string, { count: number; timestamp: number }>();

async function checkRateLimit(ip: string) {
  const MAX_REQUESTS = 100;
  const TIME_WINDOW = 60 * 1000; // 1 minute

  const now = Date.now();
  const record = rateLimit.get(ip) || { count: 0, timestamp: now };

  // Reset count if time window passed
  if (now - record.timestamp > TIME_WINDOW) {
    record.count = 1;
    record.timestamp = now;
  } else {
    record.count += 1;
  }

  rateLimit.set(ip, record);

  // Clean up old entries periodically
  if (rateLimit.size > 10000) {
    const expireTime = now - TIME_WINDOW;
    for (const [key, value] of rateLimit.entries()) {
      if (value.timestamp < expireTime) {
        rateLimit.delete(key);
      }
    }
  }

  return {
    limited: record.count > MAX_REQUESTS,
    retryAfter: Math.ceil((record.timestamp + TIME_WINDOW - now) / 1000),
  };
}

function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    'python',
    'Python',
    'requests/',
    'urllib',
    'aiohttp',
    'httpx',
    'bot',
    'Bot',
    'crawl',
    'Crawl',
    'spider',
    'Spider',
    'curl',
    'wget',
    'Scrapy',
    'PhantomJS',
    'Headless',
    'semrush',
    'ahrefsbot',
    'mj12bot',
    'dotbot',
  ];

  return suspiciousPatterns.some((pattern) => userAgent.includes(pattern));
}

function isPostRequest(request: NextRequest): boolean {
  return request.method === 'POST';
}

function hasValidCSRFToken(request: NextRequest): boolean {
  // For POST requests, check if the CSRF token is valid
  const csrfToken = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('csrf-token')?.value;

  return (
    csrfToken !== undefined &&
    csrfCookie !== undefined &&
    csrfToken === csrfCookie
  );
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
