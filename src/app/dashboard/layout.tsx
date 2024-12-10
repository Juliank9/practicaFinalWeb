'use client';

import {useEffect} from 'react';
import {useRouter, usePathname} from 'next/navigation'; // Importa usePathname para obtener la ruta actual
import {getToken} from '../../utils/auth';

export default function RootLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); // Hook para obtener la ruta actual

    useEffect(() => {
        const token = getToken();

        // Redirige al login solo si no hay token y no estás en una ruta pública
        if (!token && !pathname.startsWith('/auth')) {
            router.push('/auth/login');
        }
    }, [router, pathname]);

    return (
        <html lang="es">
        <body>
        {children}
        </body>
        </html>
    );
}
