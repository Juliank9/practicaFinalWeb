import Link from 'next/link';
import '../styles/globals.css';

export default function ClientCard({ client }: { client: any }) {
    return (
        <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-lg font-bold">{client.name}</h2>
            <p className="text-gray-600">CIF: {client.cif}</p>
            <p className="text-gray-600">
                Dirección: {client.address.street}, {client.address.number}, {client.address.city}
            </p>
            <p className="text-gray-600">Provincia: {client.address.province}</p>

            <div className="mt-4 flex justify-end">
                {/* Correctly using Link without <a> */}
                <Link
                    href={`/clients/${client._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Ver detalles
                </Link>
            </div>
        </div>
    );
}
