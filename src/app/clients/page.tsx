'use client';

import '../../styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ClientCard from '../../components/ClientCard';

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Incluye el token en el header
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setClients(data); // Supone que el endpoint devuelve un array de clientes
                } else {
                    setError('Error al cargar los clientes.');
                }
            } catch (err) {
                console.error('Error al conectar con la API:', err);
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleCreateClient = () => {
        router.push('/clients/new');
    };

    const handleClientClick = (clientId: string) => {
        router.push(`/clients/${clientId}`); // Redirige a la página de detalles del cliente
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            <main className="flex-grow container mx-auto py-8">
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Clientes</h1>
                    <button
                        onClick={handleCreateClient}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nuevo Cliente
                    </button>
                </header>

                {loading && <p>Cargando clientes...</p>}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clients.map((client: any) => (
                            <ClientCard key={client.id || client.cif} client={client}/>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer/>
        </div>
    );
}
