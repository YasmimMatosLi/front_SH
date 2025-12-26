// src/middleware/index.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/admin'];
const publicRoutes = ['/login', '/forgot-password', '/register-admin'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const role = request.cookies.get('user_role')?.value;

    const pathname = request.nextUrl.pathname;

    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtected && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'Faça login para acessar esta página');
        return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/admin') && token && role !== 'admin') {
        const dashboardUrl = new URL('/dashboard', request.url);
        dashboardUrl.searchParams.set('error', 'Acesso negado: necessário perfil de administrador');
        return NextResponse.redirect(dashboardUrl);
    }

    const isPublic = publicRoutes.some(route => pathname.startsWith(route));
    if (isPublic && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/forgot-password', '/register-admin'],
};