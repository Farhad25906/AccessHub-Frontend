import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the required permission for each route prefix
const routePermissions: Record<string, string> = {
  '/dashboard': 'view_dashboard',
  '/users': 'view_users',
  '/leads': 'view_leads',
  '/tasks': 'manage_tasks',
  '/reports': 'view_reports',
  '/audit-logs': 'view_audit_logs',
  '/customer-portal': 'access_customer_portal',
  '/settings': 'manage_settings',
};

// Routes that don't need auth (public routes)
const publicRoutes = ['/login', '/signup', '/verify', '/403'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Verify authentication
  const token = request.cookies.get('accessToken')?.value;
  const permissionsStr = request.cookies.get('userPermissions')?.value;
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect root to dashboard (if authorized)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Find if this path requires a specific permission
  const matchingRoute = Object.keys(routePermissions).find(route => pathname.startsWith(route));
  
  if (matchingRoute) {
    const requiredPermission = routePermissions[matchingRoute];
    
    // Evaluate permission (role agnostic check)
    try {
      const userPermissions: string[] = permissionsStr ? JSON.parse(permissionsStr) : [];
      if (!userPermissions.includes(requiredPermission)) {
        // User does not have the required permission
        return NextResponse.redirect(new URL('/403', request.url));
      }
    } catch (e) {
      // Cookie parsing error -> assume unauthorized
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\..*).*)'],
};
