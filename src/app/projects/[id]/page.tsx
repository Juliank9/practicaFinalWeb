'use client';

import '../../../styles/globals.css';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function ProjectDetailsPage({params}: { params: { id: string } }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch project details
        const projectResponse = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

        // Fetch clients
        const clientsResponse = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });

        if (projectResponse.ok && clientsResponse.ok) {
          const projectData = await projectResponse.json();
          const clientsData = await clientsResponse.json();

          // Create a map of clients for quick lookup
          const clientsMap = clientsData.reduce((map: any, client: any) => {
            map[client._id] = client.name;
            return map;
          }, {});

          // Enrich the project data with the client name
          const projectWithClient = {
            ...projectData,
            clientName: clientsMap[projectData.clientId] || 'Desconocido',
          };

          setProject(projectWithClient);
        } else {
          setError('Error al cargar los detalles del proyecto o los clientes.');
        }
      } catch (err) {
        console.error('Error al conectar con la API:', err);
        setError('Error al conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/projects/edit/${params.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      return;
    }

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${params.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (response.ok) {
        alert('Proyecto eliminado correctamente.');
        router.push('/projects');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al eliminar el proyecto.');
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>

      <main className="flex-grow container mx-auto py-8">
        {loading && <p>Cargando detalles del proyecto...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && project && (
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
            <p className="text-gray-500 mb-2">Código: {project.code}</p>
            <p className="text-gray-500 mb-2">Cliente: {project.clientName}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleEdit}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => router.push('/projects')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Volver
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer/>
    </div>
  );
}
