'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {getToken} from '../../../utils/auth';

export default function NewClientPage() {
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if (!token) {
            alert('Debes iniciar sesión para acceder a esta página');
            router.push('/auth/login'); // Redirige al login
        }
    }, [router]);

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Crear Nuevo Cliente</h1>
            {/* Contenido del formulario aquí */}
        </section>
    );
}
