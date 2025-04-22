import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

// Paths that don't require authentication
const publicPaths = [
  '/', // Landing page
  '/login', // Login page
  '/register', // Register page
  '/api/auth', // Register API route
  '/api/auth/login', // Login API route
  '/api/auth/logout', // Logout API route
  '/api/test', // Test API endpoint
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware processing path:', path);

  // Prepare headers to potentially pass along
  const requestHeaders = new Headers(request.headers);
  // Add the current path to headers for layout usage
  requestHeaders.set('x-current-path', path);

  // Skip middleware for public paths
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    console.log('Public path, skipping auth check:', path);
    // Still pass the headers with the path
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Check for static files and skip authentication
  if (
    path.startsWith('/_next/') ||
    path.includes('/static/') ||
    path.endsWith('.ico') ||
    path.endsWith('.png') || 
    path.endsWith('.jpg') ||
    path.endsWith('.svg') ||
    path.endsWith('.css') ||
    path.endsWith('.js')
  ) {
     // Still pass the headers with the path
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For client-side protected routes like dashboard
  if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
    // For dashboard pages, we'll handle the auth check client-side
    console.log('Client-side auth route, skipping middleware check:', path);
     // Still pass the headers with the path
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For API routes, check the token in the header
  if (path.startsWith('/api/')) {
    console.log('API route detected:', path);
    
    // Get token from header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? `${authHeader.substring(0, 15)}...` : 'null');
    
    // Skip token validation for profile API GET requests (use demo user)
    if (path.startsWith('/api/profile') && request.method === 'GET') {
      console.log('Profile API GET request, proceeding to allow demo user fallback');
       // Pass headers with path
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    
    // For all other protected API requests, require token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found for protected API route');
      // Return response directly, no need to modify headers here for error
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    if (!token) {
      console.log('Empty token in auth header');
      // Return response directly
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    console.log('Token extracted, length:', token.length);
    
    try {
      // Verify token
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      console.log('Secret key length for verification:', secretKey.length);
      
      const decoded = jwt.verify(token, secretKey);
      console.log('Token verified successfully, userId:', (decoded as any).userId);
      
      if (!(decoded as any).userId) {
        console.error('Token missing userId claim');
         // Return response directly
        return NextResponse.json(
          { error: 'Invalid token format' },
          { status: 401 }
        );
      }
      
      // Add user info to existing request headers object (already has x-current-path)
      requestHeaders.set('x-user-id', (decoded as any).userId);
      requestHeaders.set('x-user-role', (decoded as any).role || 'user');
      
      console.log('Added user info to headers, proceeding');
      // Pass modified headers
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Token verification error:', error);
       // Return response directly
      return NextResponse.json(
        { 
          error: 'Invalid token',
          details: error instanceof Error ? error.message : 'Unknown verification error'
        },
        { status: 401 }
      );
    }
  }

  // For all other routes, check authentication (this case might not be reachable often depending on matcher)
  console.log('Unauthorized route, returning 401:', path);
   // Return response directly
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  );
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // Apply middleware to ALL paths initially, then use logic inside to skip
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 