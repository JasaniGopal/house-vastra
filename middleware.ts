import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is trying to access a protected route
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isVendorRoute = request.nextUrl.pathname.startsWith('/vendor');

  if (isAdminRoute || isVendorRoute) {
    // Check for the mock authentication cookie
    const partnerRole = request.cookies.get('partner_role')?.value;

    // If there is no cookie at all, redirect to the respective login page
    if (!partnerRole) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin-login', request.url));
      } else {
        return NextResponse.redirect(new URL('/partner-login', request.url));
      }
    }

    // If they are trying to access /admin but aren't an admin, redirect to admin-login
    if (isAdminRoute && partnerRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // If they are trying to access /vendor but aren't a vendor or admin, redirect to login
    if (isVendorRoute && partnerRole !== 'vendor' && partnerRole !== 'admin') {
      return NextResponse.redirect(new URL('/partner-login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
  ],
};
