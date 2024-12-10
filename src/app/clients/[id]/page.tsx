'use client';

import '../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ClientDetailsPage({params}: { params: { id: string } }) {
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const {id} = await params; // Aseguramos que params es resuelto correctamente.
                if (!id) {
                    throw new Error('ID del cliente no encontrado.');
                }

                const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los datos del cliente.');
                }

                const data = await response.json();
                setClient(data);
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos del cliente.');
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [params]);

    const handleEditClient = (id: string) => {
        router.push(`/clients/edit/${id}`);
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            return;
        }

        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${client._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el cliente.');
            }

            alert('Cliente eliminado con éxito.');
            router.push('/clients');
        } catch (err) {
            console.error(err);
            alert('Error al eliminar el cliente.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow container mx-auto py-8">
                {loading && <p>Cargando datos del cliente...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {client && (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{client.name}</h1>
                        <p>
                            <strong>CIF:</strong> {client.cif}
                        </p>
                        <p>
                            <strong>Dirección:</strong> {client.address.street}, {client.address.number},{' '}
                            {client.address.city}, {client.address.postal}, {client.address.province}
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={() => handleEditClient(client._id)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Editar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => router.push('/clients')}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    );
}
