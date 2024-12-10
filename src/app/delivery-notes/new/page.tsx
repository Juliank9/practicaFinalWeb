'use client';

import '../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function NewDeliveryNotePage() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState({
        clientId: '',
        projectId: '',
        format: 'material', // Valor por defecto
        material: '',
        hours: 0,
        description: '',
        workdate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                const projectsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (clientsResponse.ok && projectsResponse.ok) {
                    const clientsData = await clientsResponse.json();
                    const projectsData = await projectsResponse.json();
                    setClients(clientsData);
                    setProjects(projectsData);
                } else {
                    setError('Error al cargar clientes o proyectos.');
                }
            } catch (err) {
                console.error('Error al conectar con la API:', err);
                setError('Error al conectar con el servidor.');
            }
        };

        fetchData();
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
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Albarán creado correctamente.');
                router.push('/delivery-notes');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Hubo un problema al crear el albarán.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <main className="flex-grow container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Crear Nuevo Albarán</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Cliente*</label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Seleccionar un cliente</option>
                            {clients.map((client: any) => (
                                <option key={client._id} value={client._id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Proyecto Asociado*</label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Seleccionar un proyecto</option>
                            {projects.map((project: any) => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Formato*</label>
                        <select
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="material">Material</option>
                            <option value="hours">Horas</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Material</label>
                        <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Horas</label>
                        <input
                            type="number"
                            name="hours"
                            value={formData.hours}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Descripción*</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-bold">Fecha de Trabajo*</label>
                        <input
                            type="date"
                            name="workdate"
                            value={formData.workdate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => router.push('/delivery-notes')}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {loading ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </main>

            <Footer/>
        </div>
    );
}