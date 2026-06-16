import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin-login", req.url));
      }
    }

    // Vendor routes (Admin can also access vendor routes if needed, but let's restrict to VENDOR or ADMIN)
    if (pathname.startsWith("/vendor")) {
      if (token?.role !== "VENDOR" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/partner-login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If they are trying to access protected routes, ensure they have a token
        if (req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/vendor")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/:path*",
  ],
};
