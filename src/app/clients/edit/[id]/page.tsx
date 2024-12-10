'use client';

import '../../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function EditClientPage({params}: { params: { id: string } }) {
    const [clientData, setClientData] = useState({
        name: '',
        cif: '',
        street: '',
        number: '',
        postal: '',
        city: '',
        province: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchClient = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar los datos del cliente.');
                }

                const data = await response.json();
                setClientData({
                    name: data.name || '',
                    cif: data.cif || '',
                    street: data.address?.street || '',
                    number: data.address?.number || '',
                    postal: data.address?.postal || '',
                    city: data.address?.city || '',
                    province: data.address?.province || '',
                });
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos del cliente.');
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setClientData({...clientData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify({
                    name: clientData.name,
                    cif: clientData.cif,
                    address: {
                        street: clientData.street,
                        number: clientData.number,
                        postal: clientData.postal,
                        city: clientData.city,
                        province: clientData.province,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el cliente.');
            }

            alert('Cliente actualizado con éxito.');
            router.push('/clients');
        } catch (err) {
            console.error(err);
            setError('Error al actualizar el cliente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading ? (
                    <p>Cargando datos del cliente...</p>
                ) : (
                    <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-1">Nombre del Cliente o Empresa*</label>
                            <input
                                type="text"
                                name="name"
                                value={clientData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">CIF</label>
                            <input
                                type="text"
                                name="cif"
                                value={clientData.cif}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Dirección</label>
                            <input
                                type="text"
                                name="street"
                                value={clientData.street}
                                onChange={handleChange}
                                placeholder="Calle"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="number"
                                value={clientData.number}
                                onChange={handleChange}
                                placeholder="Número"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="postal"
                                value={clientData.postal}
                                onChange={handleChange}
                                placeholder="Código Postal"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="city"
                                value={clientData.city}
                                onChange={handleChange}
                                placeholder="Ciudad"
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="text"
                                name="province"
                                value={clientData.province}
                                onChange={handleChange}
                                placeholder="Provincia"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => router.push('/clients')}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                )}
            </main>
            <Footer/>
        </div>
    );
}
