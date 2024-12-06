'use client';

import {useAuth} from '../../hooks/useAuth';
import Navbar from '../../components/Header';
import Footer from '../../components/Footer';


export default function ClientsPage() {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) return null; // Evitar renderizar mientras verifica la autenticación

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-grow container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Gestión de Clientes</h1>
                <p className="text-lg text-gray-700">
                    Aquí puedes gestionar tus clientes. Usa las herramientas disponibles para añadir, editar o eliminar
                    clientes.
                </p>
            </main>
            <Footer/>
        </div>
    );
}
