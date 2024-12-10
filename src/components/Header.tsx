'use client';

import '../styles/globals.css';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function Header() {
    const router = useRouter();

    const handleLogout = () => {
        // Limpia localStorage y cookies
        localStorage.clear();
        document.cookie = 'jwt=; Max-Age=0; path=/;';

        // Redirige al login
        router.push('/auth/login');
    };

    return (
        <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
            <h1 className="text-lg font-bold">
                <Link href="/dashboard">Gestión de Albaranes</Link>
            </h1>
            <ul className="flex gap-4 items-center">
                <li>
                    <Link href="/clients" className="hover:underline">
                        Clientes
                    </Link>
                </li>
                <li>
                    <Link href="/projects" className="hover:underline">
                        Proyectos
                    </Link>
                </li>
                <li>
                    <Link href="/delivery-notes" className="hover:underline">
                        Albaranes
                    </Link>
                </li>
                <li>
                    {/* Botón de Cerrar Sesión */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                    >
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </nav>
    );
}
