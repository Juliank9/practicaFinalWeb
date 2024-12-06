
'use client';

import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Header'; // Asegúrate de tener el componente Navbar
import Footer from '../../components/Footer'; // Asegúrate de tener el componente Footer

export default function DashboardPage() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Cargando...</p>; // Mostrar un mensaje mientras se valida
    }

    if (!isAuthenticated) {
        return null; // No renderizar nada si no está autenticado
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Bienvenido al Dashboard</h1>
                <p className="text-lg text-gray-700">
                    Aquí puedes gestionar tus clientes, proyectos y albaranes.
                </p>
            </main>
            <Footer />
        </div>
    );
}

