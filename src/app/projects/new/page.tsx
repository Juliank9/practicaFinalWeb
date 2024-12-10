'use client';

import '../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function NewProjectPage() {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        clientId: '',
        name: '',
        code: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar lista de clientes para seleccionar
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setClients(data);
                } else {
                    setError('Error al cargar los clientes.');
                }
            } catch (err) {
                console.error('Error al conectar con la API:', err);
                setError('Error al conectar con el servidor.');
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Proyecto creado con éxito.');
                router.push('/projects');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Hubo un problema al crear el proyecto.');
            }
        } catch (err) {
            console.error('Error al conectar con la API:', err);
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Nuevo Proyecto</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <div className="mb-4">
                    <label className="block mb-1">Cliente</label>
                    <select
                        name="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Seleccionar cliente</option>
                        {clients.map((client: any) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Nombre del Proyecto</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Código del Proyecto</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.push('/projects')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                    >
                        {loading ? 'Creando...' : 'Crear Proyecto'}
                    </button>
                </div>
            </form>
        </div>
    );
}
