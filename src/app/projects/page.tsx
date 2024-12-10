'use client';

import '../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [selectedClientId, setSelectedClientId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch proyectos y clientes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (projectsResponse.ok && clientsResponse.ok) {
                    const projectsData = await projectsResponse.json();
                    const clientsData = await clientsResponse.json();

                    // Crear un mapa para buscar clientes por ID
                    const clientsMap = clientsData.reduce((map: any, client: any) => {
                        map[client._id] = client.name;
                        return map;
                    }, {});

                    // Agregar el nombre del cliente a cada proyecto
                    const projectsWithClients = projectsData.map((project: any) => ({
                        ...project,
                        clientName: clientsMap[project.clientId] || 'Desconocido',
                    }));

                    setProjects(projectsWithClients);
                    setClients(clientsData);
                    setFilteredProjects(projectsWithClients); // Inicialmente mostrar todos
                } else {
                    setError('Error al cargar proyectos o clientes.');
                }
            } catch (err) {
                console.error('Error al conectar con la API:', err);
                setError('Error al conectar con el servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateProject = () => {
        router.push('/projects/new');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const clientId = e.target.value;
        setSelectedClientId(clientId);

        if (clientId === '') {
            setFilteredProjects(projects); // Mostrar todos si no se selecciona ningún cliente
        } else {
            setFilteredProjects(
                projects.filter((project: any) => project.clientId === clientId)
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>

            <main className="flex-grow container mx-auto py-8">
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Proyectos</h1>
                    <button
                        onClick={handleCreateProject}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nuevo Proyecto
                    </button>
                </header>

                <div className="mb-4">
                    <label className="block mb-2 text-gray-700">Filtrar por Cliente</label>
                    <select
                        value={selectedClientId}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Todos los clientes</option>
                        {clients.map((client: any) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                {loading && <p>Cargando proyectos...</p>}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project: any) => (
                            <div
                                key={project._id}
                                className="p-4 border rounded shadow hover:shadow-lg transition"
                            >
                                <h2 className="text-xl font-bold">{project.name}</h2>
                                <p className="text-gray-500">Código: {project.code}</p>
                                <p className="text-gray-500">Cliente: {project.clientName}</p>
                                <button
                                    onClick={() => router.push(`/projects/${project._id}`)}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Ver detalles
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer/>
        </div>
    );
}