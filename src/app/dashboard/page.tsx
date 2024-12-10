'use client';

import '../../styles/globals.css';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        // Elimina token del localStorage y cookies
        localStorage.clear();
        document.cookie = 'jwt=; Max-Age=0; path=/;';

        // Redirige al login
        router.push('/auth/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt'); // Verificar token
        if (!token) {
            router.push('/auth/login'); // Redirige al login si no hay token
        }
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold">Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Cerrar Sesión
                </button>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h2>
                <p className="text-lg text-gray-700 mb-6">
                    Usa las opciones a continuación para gestionar tus datos:
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => router.push('/clients')}
                        className="bg-green-500 text-white p-4 rounded hover:bg-green-600"
                    >
                        Gestionar Clientes
                    </button>
                    <button
                        onClick={() => router.push('/projects')}
                        className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600"
                    >
                        Gestionar Proyectos
                    </button>
                    <button
                        onClick={() => router.push('/delivery-notes')}
                        className="bg-yellow-500 text-white p-4 rounded hover:bg-yellow-600"
                    >
                        Gestionar Albaranes
                    </button>
                </div>
            </main>

            <footer className="bg-gray-800 text-white text-center p-4">
                &copy; 2024 Gestión de Albaranes
            </footer>
        </div>
    );
}