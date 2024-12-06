'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function CompleteRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surnames: '',
        nif: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/user/register', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Error al completar el registro');
            }

            alert('Registro completado con éxito');
            router.push('/auth/login'); // Redirige al login
        } catch (err) {
            alert('Hubo un error al completar el registro.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Completar Registro</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
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
                    <label className="block text-sm font-medium">Apellidos</label>
                    <input
                        type="text"
                        name="surnames"
                        value={formData.surnames}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">NIF</label>
                    <input
                        type="text"
                        name="nif"
                        value={formData.nif}
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
                    {loading ? 'Guardando...' : 'Completar Registro'}
                </button>
            </form>
        </section>
    );
}
