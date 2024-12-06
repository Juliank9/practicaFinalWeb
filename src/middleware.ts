import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const jwtCookie = request.cookies.get('jwt'); // Obtén la cookie jwt

    // Si no hay cookie jwt y la ruta no es pública, redirige al login
    if (!jwtCookie && !request.nextUrl.pathname.startsWith('/auth')) {
        const url = request.nextUrl.clone();
        url.pathname = '/auth/login';
        return NextResponse.redirect(url);
    }

    // Permitir acceso a las páginas públicas
    return NextResponse.next();
}

// Aplicar el middleware a las rutas protegidas
export const config = {
    matcher: ['/dashboard/:path*', '/clients/:path*', '/projects/:path*', '/deliverynotes/:path*', '/'],
};
