'use client';

import '../../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function EditProjectPage({params}: { params: { id: string } }) {
    const router = useRouter();
    const [project, setProject] = useState<any>({
        name: '',
        code: '',
        clientId: '',
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details
                const projectResponse = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (projectResponse.ok && clientsResponse.ok) {
                    const projectData = await projectResponse.json();
                    const clientsData = await clientsResponse.json();

                    setProject({
                        name: projectData.name,
                        code: projectData.code,
                        clientId: projectData.clientId,
                    });
                    setClients(clientsData);
                } else {
                    setError('Error al cargar los datos del proyecto o clientes.');
                }
            } catch (err) {
                console.error('Error al conectar con la API:', err);
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setProject({...project, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(project),
            });

            if (response.ok) {
                alert('Proyecto actualizado correctamente.');
                router.push('/projects');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al actualizar el proyecto.');
            }
        } catch (err) {
            setError('Error al conectar con el servidor.');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <main className="flex-grow container mx-auto py-8">
                {loading && <p>Cargando datos del proyecto...</p>}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-bold mb-4">Editar Proyecto</h1>

                        <div className="mb-4">
                            <label className="block mb-1">Nombre del Proyecto</label>
                            <input
                                type="text"
                                name="name"
                                value={project.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Código</label>
                            <input
                                type="text"
                                name="code"
                                value={project.code}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Cliente</label>
                            <select
                                name="clientId"
                                value={project.clientId}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Selecciona un cliente</option>
                                {clients.map((client: any) => (
                                    <option key={client._id} value={client._id}>
                                        {client.name}
                                    </option>
                                ))}
                            </select>
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
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <Footer/>
        </div>
    );
}
