'use client';

import '../../../../styles/globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

export default function EditDeliveryNotePage({ params }: { params: { id: string } }) {
  const [deliveryNote, setDeliveryNote] = useState<any>(null);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formValues, setFormValues] = useState({
    clientId: '',
    projectId: '',
    format: '',
    material: '',
    hours: '',
    description: '',
    workdate: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const deliveryNoteId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deliveryNoteResponse, clientsResponse, projectsResponse] = await Promise.all([
          fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${deliveryNoteId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
          }),
          fetch('https://bildy-rpmaya.koyeb.app/api/client', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
          }),
          fetch('https://bildy-rpmaya.koyeb.app/api/project', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
          }),
        ]);

        if (deliveryNoteResponse.ok && clientsResponse.ok && projectsResponse.ok) {
          const deliveryNoteData = await deliveryNoteResponse.json();
          const clientsData = await clientsResponse.json();
          const projectsData = await projectsResponse.json();

          setDeliveryNote(deliveryNoteData);
          setClients(clientsData);
          setProjects(projectsData);

          // Set initial form values based on the delivery note data
          setFormValues({
            clientId: deliveryNoteData.clientId || '',
            projectId: deliveryNoteData.projectId || '',
            format: deliveryNoteData.format || '',
            material: deliveryNoteData.material || '',
            hours: deliveryNoteData.hours || '',
            description: deliveryNoteData.description || '',
            workdate: deliveryNoteData.workdate || '',
          });
        } else {
          setError('Error al cargar datos del albarán, clientes o proyectos.');
        }
      } catch (err) {
        console.error('Error al conectar con la API:', err);
        setError('Error al conectar con el servidor.');
      }
    };

    fetchData();
  }, [deliveryNoteId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${deliveryNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        alert('Albarán actualizado correctamente.');
        router.push('/delivery-notes');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el albarán.');
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      setError('Error al conectar con el servidor.');
    }
  };

  if (!deliveryNote) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto py-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Cargando datos del albarán...</p>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Editar Albarán</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Cliente</label>
            <select
              name="clientId"
              value={formValues.clientId}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((client: any) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Proyecto</label>
            <select
              name="projectId"
              value={formValues.projectId}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            >
              <option value="">Seleccionar proyecto</option>
              {projects.map((project: any) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Formato</label>
            <input
              type="text"
              name="format"
              value={formValues.format}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Material</label>
            <input
              type="text"
              name="material"
              value={formValues.material}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Horas</label>
            <input
              type="number"
              name="hours"
              value={formValues.hours}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de Trabajo</label>
            <input
              type="date"
              name="workdate"
              value={formValues.workdate}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Guardar Cambios
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
