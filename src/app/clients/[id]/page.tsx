// Placeholder content for src/app/clients/[id]/page.tsx
import {useRouter} from 'next/navigation';

export default function ClientDetailPage({params}: { params: { id: string } }) {
    const {id} = params;

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Detalles del Cliente {id}</h1>
            <p>Información detallada del cliente será cargada aquí.</p>
        </section>
    );
}
