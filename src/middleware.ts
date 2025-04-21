// Import the Next.js middleware types
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicPaths = ["/", "/sign-in", "/sign-up"];

// Simple middleware function
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow API routes to handle their own authentication
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Allow public routes
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // For all other routes, check authentication via cookie
    const authCookie = request.cookies.get("__session");

    // If no auth cookie, redirect to sign-in
    if (!authCookie) {
        // Redirect to sign-in if not authenticated
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Continue with the request
    return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
    matcher: [
        // Skip static files
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};