'use client';

import '../../styles/globals.css';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DeliveryNotesPage() {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDeliveryNotes = async () => {
      try {
        const [deliveryNotesResponse, clientsResponse] = await Promise.all([
          fetch('https://bildy-rpmaya.koyeb.app/api/deliverynote', {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
          }),
          fetch('https://bildy-rpmaya.koyeb.app/api/client', {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
          }),
        ]);

        if (deliveryNotesResponse.ok && clientsResponse.ok) {
          const deliveryNotesData = await deliveryNotesResponse.json();
          const clientsData = await clientsResponse.json();

          const clientsMap = clientsData.reduce((map: any, client: any) => {
            map[client._id] = client.name;
            return map;
          }, {});

          const deliveryNotesWithDetails = deliveryNotesData.map((note: any) => ({
            ...note,
            clientName: clientsMap[note.clientId] || 'Cliente desconocido',
          }));

          setDeliveryNotes(deliveryNotesWithDetails);
        } else {
          setError('Error al cargar datos de albaranes o clientes.');
        }
      } catch (err) {
        console.error('Error al conectar con la API:', err);
        setError('Error al conectar con el servidor.');
      }
    };

    fetchDeliveryNotes();
  }, []);

  const handleCreateDeliveryNote = () => {
    router.push('/delivery-notes/new');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow container mx-auto py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Listado de Albaranes</h1>
          <button
            onClick={handleCreateDeliveryNote}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Crear Albarán
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveryNotes.map((note: any) => (
            <div
              key={note._id}
              className="p-4 border rounded shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold">{note.description}</h2>
              <p><strong>Cliente:</strong> {note.clientName}</p>
              <p><strong>Fecha de trabajo:</strong> {note.workdate || 'No especificada'}</p>
              <button
                onClick={() => router.push(`/delivery-notes/${note._id}`)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ver detalles
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </div>
  );
}
