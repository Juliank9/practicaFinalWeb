'use client';

import '../../../styles/globals.css';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function NewClientPage() {
    const [formData, setFormData] = useState({
        name: '',
        cif: '',
        street: '',
        number: '',
        postal: '',
        city: '',
        province: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validación básica
        if (!formData.name || !formData.street || !formData.city || !formData.province) {
            setError('Por favor, completa todos los campos requeridos.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    cif: formData.cif,
                    address: {
                        street: formData.street,
                        number: parseInt(formData.number, 10), // Convertir a número
                        postal: parseInt(formData.postal, 10), // Convertir a número
                        city: formData.city,
                        province: formData.province,
                    },
                }),
            });

            if (response.ok) {
                alert('Cliente creado y guardado con éxito.');
                router.push('/clients');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Hubo un problema al guardar el cliente.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Nuevo Cliente</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-1">Nombre del Cliente o Empresa*</label>
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
                    <label className="block mb-1">CIF</label>
                    <input
                        type="text"
                        name="cif"
                        value={formData.cif}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Domicilio Fiscal</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Calle"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="Número"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="text"
                        name="postal"
                        value={formData.postal}
                        onChange={handleChange}
                        placeholder="Código Postal"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ciudad"
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="text"
                        name="province"
                        value={formData.province}
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
        </div>
    );
}
