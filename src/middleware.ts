import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    const jwtCookie = request.cookies.get('jwt'); // Obtener la cookie jwt

    // Si no hay cookie jwt y no estamos en una página pública, redirigir al login
    if (!jwtCookie && !request.nextUrl.pathname.startsWith('/auth')) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/auth/login';
        return NextResponse.redirect(loginUrl);
    }

    // Permitir acceso a rutas públicas
    return NextResponse.next();
}

// Configuración del middleware para aplicarlo solo a rutas protegidas
export const config = {
    matcher: ['/dashboard/:path*', '/clients/:path*', '/projects/:path*', '/deliverynotes/:path*', '/'],
};
