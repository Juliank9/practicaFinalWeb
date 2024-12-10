import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const jwtCookie = request.cookies.get('jwt'); // Obtener la cookie jwt

    // Si no hay cookie jwt y no estamos en una página pública, redirigir al login
    if (!jwtCookie) {
        // Evitar redirigir infinitamente si ya estamos en /auth/login
        if (!request.nextUrl.pathname.startsWith('/auth/login')) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/auth/login';
            return NextResponse.redirect(loginUrl);
        }
    } else {
        // Si hay cookie jwt y estamos en la raíz o /auth/login, redirigir al dashboard
        if (
            request.nextUrl.pathname === '/' ||
            request.nextUrl.pathname.startsWith('/auth/login')
        ) {
            const dashboardUrl = request.nextUrl.clone();
            dashboardUrl.pathname = '/dashboard';
            return NextResponse.redirect(dashboardUrl);
        }
    }

    // Permitir acceso a las demás rutas
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/clients/:path*', '/projects/:path*', '/deliverynotes/:path*', '/'], // Rutas protegidas
};
