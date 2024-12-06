'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function EditClientPage({params}: { params: { id: string } }) {
    const {id} = params;
    const router = useRouter();
    const [formData, setFormData] = useState({name: '', email: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar los datos del cliente al inicio
        const fetchClient = async () => {
            try {
                const res = await fetch(`/api/client/${id}`);
                const data = await res.json();
                setFormData({name: data.name, email: data.email});
            } catch (err) {
                console.error('Error al cargar los datos del cliente:', err);
            }
        };

        fetchClient();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`/api/client/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Error al actualizar el cliente');
            }

            alert('Cliente actualizado con éxito');
            router.push('/clients');
        } catch (err) {
            alert('Hubo un error al actualizar el cliente');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Editar Cliente</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </section>
    );
}
