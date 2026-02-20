import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/student', '/admin'];
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Redirect to login if accessing protected route without token
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing auth routes with token
    if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
        // Ideally we'd check the role here, but we'd need to decode the token or have a role cookie
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/student/:path*', '/admin/:path*', '/login', '/register'],
};
