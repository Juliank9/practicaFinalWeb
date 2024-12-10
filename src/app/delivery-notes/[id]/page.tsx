'use client';

import '../../../styles/globals.css';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function DeliveryNoteDetailsPage({params}: { params: { id: string } }) {
  const [deliveryNote, setDeliveryNote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const deliveryNoteId = params.id;

  useEffect(() => {
    if (!deliveryNoteId) {
      setError('ID de albarán no válido.');
      return;
    }

    const fetchDeliveryNoteDetails = async () => {
      try {
        const response = await fetch(
          `https://bildy-rpmaya.koyeb.app/api/deliverynote/${deliveryNoteId}`,
          {
            headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('Datos del albarán:', data);
          setDeliveryNote(data);
        } else {
          setError('No se pudo cargar el albarán. Verifica que el ID es correcto.');
        }
      } catch (err) {
        console.error('Error al conectar con la API:', err);
        setError('Error al conectar con el servidor.');
      }
    };

    fetchDeliveryNoteDetails();
  }, [deliveryNoteId]);

  const handleEdit = () => {
    router.push(`/delivery-notes/edit/${deliveryNoteId}`);
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este albarán?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://bildy-rpmaya.koyeb.app/api/deliverynote/${deliveryNoteId}`,
        {
          method: 'DELETE',
          headers: {Authorization: `Bearer ${localStorage.getItem('jwt')}`},
        }
      );

      if (response.ok) {
        alert('Albarán eliminado correctamente.');
        router.push('/delivery-notes');
      } else {
        setError('Error al eliminar el albarán.');
      }
    } catch (err) {
      console.error('Error al conectar con la API:', err);
      setError('Error al conectar con el servidor.');
    }
  };

  const handleBack = () => {
    router.push('/delivery-notes');
  };

  if (!deliveryNote) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header/>
        <main className="flex-grow container mx-auto py-8">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>Cargando detalles del albarán...</p>
          )}
        </main>
        <Footer/>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Detalles del Albarán</h1>
        <p><strong>Cliente:</strong> {deliveryNote.client?.name || 'Desconocido'}</p>
        <p><strong>Formato:</strong> {deliveryNote.format}</p>
        <p><strong>Material:</strong> {deliveryNote.material}</p>
        <p><strong>Horas:</strong> {deliveryNote.hours}</p>
        <p><strong>Descripción:</strong> {deliveryNote.description}</p>
        <p><strong>Fecha de Trabajo:</strong> {deliveryNote.date || 'Fecha no disponible'}</p>
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Editar
          </button>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Volver
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
