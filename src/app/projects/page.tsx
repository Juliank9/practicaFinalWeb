'use client';

import {useAuth} from '../../hooks/useAuth';
import Navbar from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProjectsPage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null; // Evitar renderizar mientras verifica la autenticación

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Gestión de Proyectos</h1>
                <p className="text-lg text-gray-700">
                    Aquí puedes gestionar tus proyectos. Organiza y monitorea el progreso de tus proyectos actuales.
                </p>
            </main>
            <Footer />
        </div>
    );
}

